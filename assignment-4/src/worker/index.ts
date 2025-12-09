import { Hono } from "hono";
// Minimal Env type for worker bindings used by Hono. Adjust for stronger typing if needed.
type Env = {
  DB: any;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
};
// Lazy-load @getmocha/users-service/backend at request time to avoid runtime API
// calls during dependency optimization / dev startup when env vars aren't set.
const loadBackend = async () => await import("@getmocha/users-service/backend");
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// Helper to run handlers with auth. In dev (no API key) we inject a mock user
async function runWithAuth(c: any, handler: () => Promise<any>) {
  const handleAndCatch = async () => {
    try {
      return await handler();
    } catch (err: any) {
      console.error("Worker handler error:", err);
      const message = err?.message || String(err) || "Unknown error";
      try {
        return c.json({ error: "Internal server error", detail: message }, 500);
      } catch (e) {
        // If JSON response fails, fall back to text
        return c.text(`Internal server error: ${message}`, 500);
      }
    }
  };

  if (!c.env.MOCHA_USERS_SERVICE_API_KEY) {
    // inject a lightweight mock user for local development
    c.set("user", { id: 1, google_user_data: { name: "Dev User", picture: "" } });
    return handleAndCatch();
  }

  const mod = await loadBackend();
  try {
    return await (mod.authMiddleware as any)(c, async () => {
      return await handleAndCatch();
    });
  } catch (err: any) {
    console.error("authMiddleware or handler error:", err);
    const message = err?.message || String(err) || "Unknown error";
    return c.json({ error: "Internal server error", detail: message }, 500);
  }
}

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  // Dev fallback: don't import backend when API key is not configured
  if (!c.env.MOCHA_USERS_SERVICE_API_KEY) {
    const host = (c.req as any).header?.("host") || "localhost:5173";
    const proto = (c.req as any).header?.("x-forwarded-proto") || (c.req.url.startsWith("https") ? "https" : "http");
    const mock = `${proto}://${host}/?mock_oauth=google`;
    return c.json({ redirectUrl: mock }, 200);
  }

  const mod = await loadBackend();
  try {
    const redirectUrl = await mod.getOAuthRedirectUrl("google", {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ redirectUrl }, 200);
  } catch (err: any) {
    const message = err?.message || String(err) || "Unknown error";
    return c.json({ error: "Failed to get redirect URL", detail: message }, 500);
  }
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  // Dev fallback: create a local mock session when API key missing
  if (!c.env.MOCHA_USERS_SERVICE_API_KEY) {
    const fakeToken = `dev-session-${Math.random().toString(36).slice(2, 10)}`;
    const cookieName = "MOCHA_SESSION_TOKEN";
    setCookie(c, cookieName, fakeToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 24 * 60 * 60,
    });
    (c as any).set("user", { id: 1, google_user_data: { name: "Dev User", picture: "" } });
    return c.json({ success: true, mock: true, token: fakeToken }, 200);
  }

  const mod = await loadBackend();
  try {
    const sessionToken = await mod.exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, mod.MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (err: any) {
    const message = err?.message || String(err) || "Unknown error";
    return c.json({ error: "Failed to exchange code for session token", detail: message }, 500);
  }
});

app.get("/api/users/me", async (c) => {
  return runWithAuth(c, async () => {
    return c.json(c.get("user"));
  });
});

app.get("/api/logout", async (c) => {
  // If no API key, clear the mock cookie and return
  if (!c.env.MOCHA_USERS_SERVICE_API_KEY) {
    setCookie(c, "MOCHA_SESSION_TOKEN", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
      maxAge: 0,
    });
    return c.json({ success: true, mock: true }, 200);
  }

  const mod = await loadBackend();
  const sessionToken = getCookie(c, mod.MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await mod.deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, mod.MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Activity schemas
const ActivitySchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  minutes: z.number().int().positive(),
  start_minute: z.number().int().min(0).max(1439).nullable().optional(),
});

const UpdateActivitySchema = ActivitySchema.partial();

// Ensure activities table exists (idempotent). This helps local dev where D1
// may be uninitialized. It's safe to call on every request.
async function ensureActivitiesTable(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        activity_date TEXT,
        title TEXT,
        category TEXT,
        minutes INTEGER,
        start_minute INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (err: any) {
    console.warn("ensureActivitiesTable failed:", err?.message || err);
  }
}

// Simple in-memory fallback used in local dev when D1 is missing or uninitialized.
const inMemoryStore: {
  activities: Array<any>;
  nextId: number;
} = { activities: [], nextId: 1 };

function fallbackSelectActivities(userId: number, date: string) {
  return inMemoryStore.activities.filter((a) => a.user_id === userId && a.activity_date === date).sort((x, y) => {
    const sx = x.start_minute ?? 0;
    const sy = y.start_minute ?? 0;
    return sx - sy || (x.created_at > y.created_at ? 1 : -1);
  });
}

function fallbackInsertActivity(userId: number, date: string, activity: any) {
  const id = inMemoryStore.nextId++;
  const now = new Date().toISOString();
  const row = {
    id,
    user_id: userId,
    activity_date: date,
    title: activity.title,
    category: activity.category,
    minutes: activity.minutes,
    start_minute: activity.start_minute ?? null,
    created_at: now,
    updated_at: now,
  };
  inMemoryStore.activities.push(row);
  return row;
}

function fallbackUpdateActivity(id: number, userId: number, updates: any) {
  const idx = inMemoryStore.activities.findIndex((a) => a.id === id && a.user_id === userId);
  if (idx === -1) return null;
  const existing = inMemoryStore.activities[idx];
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  inMemoryStore.activities[idx] = updated;
  return updated;
}

function fallbackDeleteActivity(id: number, userId: number) {
  const idx = inMemoryStore.activities.findIndex((a) => a.id === id && a.user_id === userId);
  if (idx === -1) return false;
  inMemoryStore.activities.splice(idx, 1);
  return true;
}

// Get activities for a specific date
app.get("/api/activities/:date", async (c) => {
  return runWithAuth(c, async () => {
    const user = c.get("user");
    const date = c.req.param("date");

    await ensureActivitiesTable(c.env.DB);
      try {
        const { results } = await c.env.DB.prepare(
          "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY start_minute ASC, created_at ASC"
        )
          .bind(user!.id, date)
          .all();

        return c.json(results);
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg && msg.includes("no such table")) {
          // DB not initialized locally — fall back to in-memory store so UI can operate.
          const rows = fallbackSelectActivities(Number(user!.id), date);
          return c.json(rows);
        }
        throw err;
      }
  });
});

// Create a new activity
app.post("/api/activities", async (c) => {
  return runWithAuth(c, async () => {
    const user = c.get("user");
    const body = await c.req.json();
    
    const validated = ActivitySchema.parse(body);
    const date = body.date;

    if (!date) {
      return c.json({ error: "Date is required" }, 400);
    }

      await ensureActivitiesTable(c.env.DB);

      let total_minutes: number = 0;
      try {
        const row = await c.env.DB.prepare(
          "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ?"
        )
          .bind(user!.id, date)
          .first() as { total_minutes: number } | undefined;
        total_minutes = (row && (row as any).total_minutes) || 0;
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg && msg.includes("no such table")) {
          // Use in-memory fallback for POST when DB uninitialized
          total_minutes = fallbackSelectActivities(Number(user!.id), date).reduce((s, a) => s + (a.minutes || 0), 0);
        } else {
          throw err;
        }
      }

    if (total_minutes + validated.minutes > 1440) {
      return c.json({ error: "Total minutes cannot exceed 1440 for a day" }, 400);
    }

    try {
      const result = await c.env.DB.prepare(
        "INSERT INTO activities (user_id, activity_date, title, category, minutes, start_minute) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(
          user!.id,
          date,
          validated.title,
          validated.category,
          validated.minutes,
          validated.start_minute ?? null
        )
        .run();

      const activity = await c.env.DB.prepare(
        "SELECT * FROM activities WHERE id = ?"
      )
        .bind(result.meta.last_row_id)
        .first();

      return c.json(activity, 201);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg && msg.includes("no such table")) {
        // Fallback to in-memory
        const row = fallbackInsertActivity(Number(user!.id), date, validated);
        return c.json(row, 201);
      }
      throw err;
    }
  });
});

// Update an activity
app.put("/api/activities/:id", async (c) => {
  return runWithAuth(c, async () => {
    const user = c.get("user");
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const validated = UpdateActivitySchema.parse(body);

    await ensureActivitiesTable(c.env.DB);

    // Get the existing activity
    let existing: any;
    try {
      existing = await c.env.DB.prepare(
        "SELECT * FROM activities WHERE id = ? AND user_id = ?"
      )
        .bind(id, user!.id)
        .first();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg && msg.includes("no such table")) {
        existing = inMemoryStore.activities.find((a) => a.id === Number(id) && a.user_id === user!.id) || null;
      } else {
        throw err;
      }
    }

    if (!existing) {
      return c.json({ error: "Activity not found" }, 404);
    }

    // If minutes are being updated, check the daily total
    if (validated.minutes !== undefined) {
      try {
        const { total_minutes } = await c.env.DB.prepare(
          "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
        )
          .bind(user!.id, (existing as any).activity_date, id)
          .first() as { total_minutes: number };

        if (total_minutes + validated.minutes > 1440) {
          return c.json({ error: "Total minutes cannot exceed 1440 for a day" }, 400);
        }
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg && msg.includes("no such table")) {
          const total = fallbackSelectActivities(Number(user!.id), (existing as any).activity_date).reduce((s, a) => s + (a.minutes || 0), 0);
          if (total + (validated.minutes || 0) > 1440) {
            return c.json({ error: "Total minutes cannot exceed 1440 for a day" }, 400);
          }
        } else {
          throw err;
        }
      }
    }

    const updates = [];
    const values = [];

    if (validated.title !== undefined) {
      updates.push("title = ?");
      values.push(validated.title);
    }
    if (validated.category !== undefined) {
      updates.push("category = ?");
      values.push(validated.category);
    }
    if (validated.minutes !== undefined) {
      updates.push("minutes = ?");
      values.push(validated.minutes);
    }
    if (validated.start_minute !== undefined) {
      updates.push("start_minute = ?");
      values.push(validated.start_minute);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    try {
      await c.env.DB.prepare(
        `UPDATE activities SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`
      )
        .bind(...values, id, user!.id)
        .run();

      const activity = await c.env.DB.prepare(
        "SELECT * FROM activities WHERE id = ?"
      )
        .bind(id)
        .first();

      return c.json(activity);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg && msg.includes("no such table")) {
        const updatesObj: any = {};
        if (validated.title !== undefined) updatesObj.title = validated.title;
        if (validated.category !== undefined) updatesObj.category = validated.category;
        if (validated.minutes !== undefined) updatesObj.minutes = validated.minutes;
        if (validated.start_minute !== undefined) updatesObj.start_minute = validated.start_minute;
        const updated = fallbackUpdateActivity(Number(id), Number(user!.id), updatesObj);
        return c.json(updated);
      }
      throw err;
    }
  });
});

// Delete an activity
app.delete("/api/activities/:id", async (c) => {
  return runWithAuth(c, async () => {
    const user = c.get("user");
    const id = c.req.param("id");

    await ensureActivitiesTable(c.env.DB);

    try {
      await c.env.DB.prepare(
        "DELETE FROM activities WHERE id = ? AND user_id = ?"
      )
        .bind(id, user!.id)
        .run();
      return c.json({ success: true });
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg && msg.includes("no such table")) {
        const ok = fallbackDeleteActivity(Number(id), Number(user!.id));
        return c.json({ success: ok });
      }
      throw err;
    }
  });
});

// Catch-all for unmatched API routes: return JSON 404 instead of falling
// through to an HTML SPA fallback. This prevents tools (like React DevTools)
// or XHR callers from receiving `index.html` when they expect JSON.
app.all("/api/*", (c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
