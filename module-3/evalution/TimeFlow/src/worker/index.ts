import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
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

// Get activities for a specific date
app.get("/api/activities/:date", authMiddleware, async (c) => {
  const user = c.get("user");
  const date = c.req.param("date");

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY start_minute ASC, created_at ASC"
  )
    .bind(user!.id, date)
    .all();

  return c.json(results);
});

// Create a new activity
app.post("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  const validated = ActivitySchema.parse(body);
  const date = body.date;

  if (!date) {
    return c.json({ error: "Date is required" }, 400);
  }

  // Check total minutes for the day
  const { total_minutes } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ?"
  )
    .bind(user!.id, date)
    .first() as { total_minutes: number };

  if (total_minutes + validated.minutes > 1440) {
    return c.json({ error: "Total minutes cannot exceed 1440 for a day" }, 400);
  }

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
});

// Update an activity
app.put("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const validated = UpdateActivitySchema.parse(body);

  // Get the existing activity
  const existing = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user!.id)
    .first();

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  // If minutes are being updated, check the daily total
  if (validated.minutes !== undefined) {
    const { total_minutes } = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
    )
      .bind(user!.id, (existing as any).activity_date, id)
      .first() as { total_minutes: number };

    if (total_minutes + validated.minutes > 1440) {
      return c.json({ error: "Total minutes cannot exceed 1440 for a day" }, 400);
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
});

// Delete an activity
app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  await c.env.DB.prepare(
    "DELETE FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user!.id)
    .run();

  return c.json({ success: true });
});

export default app;
