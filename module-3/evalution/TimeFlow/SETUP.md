# TimeFlow Setup Guide

This guide provides detailed instructions for setting up and deploying the TimeFlow application.

## Prerequisites

- Node.js 18+ or Bun runtime
- A Mocha account (sign up at https://getmocha.com)
- Git (for version control)
- A modern web browser

## Technology Stack

### Frontend
- **React 18** - UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization library for charts
- **Lucide React** - Icon library

### Backend
- **Cloudflare Workers** - Serverless edge computing platform
- **Hono** - Fast web framework for Cloudflare Workers
- **Cloudflare D1** - SQLite-based serverless database
- **Zod** - Schema validation library

### Authentication
- **Mocha Users Service** - Managed authentication with Google OAuth
- Secure session management with HTTP-only cookies
- Built-in user profile management

## Local Development Setup

### 1. Install Dependencies

Using npm:
```bash
npm install
```

Using Bun:
```bash
bun install
```

### 2. Start Development Server

```bash
npm run dev
```

This will start:
- Vite development server on http://localhost:5173
- Hot module replacement for instant updates
- TypeScript type checking in watch mode

### 3. Database Setup

The database schema is automatically created via migrations when you deploy. For local development, the migrations will run automatically.

Database structure:
```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  minutes INTEGER NOT NULL,
  start_minute INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Environment Variables

The following secrets are automatically configured in Mocha:
- `MOCHA_USERS_SERVICE_API_URL` - Authentication service endpoint
- `MOCHA_USERS_SERVICE_API_KEY` - API key for authentication

These are set automatically by the Mocha platform and require no manual configuration.

## Project Structure

```
timeflow/
├── src/
│   ├── react-app/              # Frontend React application
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ActivityForm.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ChartPie.tsx
│   │   │   ├── ChartBar.tsx
│   │   │   └── NoDataCard.jsx
│   │   ├── pages/              # Route components
│   │   │   ├── Login.tsx
│   │   │   ├── AuthCallback.tsx
│   │   │   └── Tracker.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useActivities.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── timeUtils.ts
│   │   │   ├── analytics.ts
│   │   │   └── seedData.ts
│   │   ├── App.tsx             # Root component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── worker/                 # Backend API
│   │   └── index.ts            # Hono app with routes
│   └── shared/                 # Shared TypeScript types
│       └── types.ts
├── index.html                  # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # Project documentation
```

## Component Architecture

### Page Components (Controllers)
- **Login.tsx** - Landing page with Google OAuth authentication
- **AuthCallback.tsx** - OAuth callback handler
- **Tracker.tsx** - Main application page with activity tracking and analytics

### UI Components (Views)
- **Navbar.tsx** - Top navigation with user profile and logout
- **DatePicker.tsx** - Date selection input
- **ActivityForm.tsx** - Form to add new activities
- **ActivityList.tsx** - List of activities with edit/delete actions
- **AnalyticsDashboard.tsx** - Analytics view with charts and stats
- **ChartPie.tsx** - Pie chart for category distribution
- **ChartBar.tsx** - Bar chart for activity durations
- **NoDataCard.tsx** - Empty state component

### Custom Hooks
- **useActivities.ts** - Manages activity data fetching and mutations

## API Endpoints

### Authentication
```
GET  /api/oauth/google/redirect_url  - Get OAuth login URL
POST /api/sessions                   - Exchange code for session
GET  /api/users/me                   - Get current user
GET  /api/logout                     - Sign out
```

### Activities
```
GET    /api/activities/:date         - Get activities for date
POST   /api/activities               - Create activity
PUT    /api/activities/:id           - Update activity
DELETE /api/activities/:id           - Delete activity
```

## Data Validation

### Activity Creation
- Title: Required, non-empty string
- Category: Required, must be one of predefined categories
- Minutes: Required, positive integer
- Start Minute: Optional, integer between 0-1439
- Daily total must not exceed 1440 minutes

### Categories
- Work
- Personal
- Sleep
- Exercise
- Learning
- Entertainment
- Meals
- Commute
- Other

## Development Workflow

### Adding a New Component

1. Create component file in `src/react-app/components/`
2. Import and use in page components
3. Keep components small and focused (< 100 lines)
4. Extract repeated patterns into reusable components

Example component structure:
```tsx
import { ComponentProps } from "./types";

export default function MyComponent({ prop1, prop2 }: ComponentProps) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

### Adding a New API Route

1. Add route handler in `src/worker/index.ts`
2. Use `authMiddleware` for protected routes
3. Validate input with Zod schemas
4. Return appropriate HTTP status codes

Example route:
```typescript
app.get("/api/example", authMiddleware, async (c) => {
  const user = c.get("user");
  // Route logic
  return c.json({ data: "..." });
});
```

### Database Queries

Use D1 prepared statements for all queries:
```typescript
const result = await c.env.DB.prepare(
  "SELECT * FROM activities WHERE user_id = ?"
).bind(userId).all();
```

## Testing

### Manual Testing
1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Sign in with Google
4. Test activity CRUD operations
5. Verify 1440-minute validation
6. Test analytics dashboard

### Seed Data
Use the seed data utilities to populate test data:

```typescript
import { seedActivitiesForDate, sampleDayActivities } from "@/react-app/utils/seedData";

// Seed today's activities
await seedActivitiesForDate("2025-12-06", sampleDayActivities);
```

## Deployment

### Deploying to Mocha

The app is automatically deployed through the Mocha platform:

1. Push changes to your Mocha workspace
2. Mocha automatically builds and deploys
3. Access your app at your-app-name.mocha.app

### Build Process

The build process:
1. Compiles TypeScript to JavaScript
2. Bundles React components with Vite
3. Optimizes CSS with Tailwind
4. Minifies all assets
5. Generates sourcemaps for debugging

### Production Considerations

- All API calls use relative URLs (work in dev and prod)
- Authentication cookies use secure, httpOnly flags
- Database queries use prepared statements (SQL injection safe)
- Client-side state management prevents race conditions
- Error boundaries catch and display user-friendly errors

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npx tsc --noEmit
```

**ESLint errors:**
```bash
npx eslint --ext .ts,.tsx src/
```

### Common Issues

**Authentication not working:**
- Verify secrets are set in Mocha dashboard
- Check browser console for errors
- Clear cookies and try again

**Activities not loading:**
- Check network tab for failed requests
- Verify user is authenticated
- Check database has been migrated

**Charts not rendering:**
- Ensure activities total exactly 1440 minutes
- Check browser console for Recharts errors
- Verify data structure matches expected format

## Performance Optimization

### Frontend
- Components use React.memo for expensive renders
- Lists use proper key props for efficient updates
- Images use appropriate formats and sizes
- Lazy loading for non-critical components

### Backend
- Database queries use indexes on user_id and date
- API responses are minimal (no unnecessary data)
- Sessions cached to reduce auth service calls
- Edge computing reduces latency globally

## Security Best Practices

- Never expose API keys in frontend code
- All secrets stored in environment variables
- Authentication required for all data access
- User data scoped to authenticated user only
- SQL injection prevented with prepared statements
- XSS prevented by React's automatic escaping
- CSRF tokens handled by authentication service

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Additional Resources

- [Mocha Documentation](https://docs.getmocha.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Hono Framework](https://hono.dev)
- [Cloudflare D1](https://developers.cloudflare.com/d1)
- [Recharts](https://recharts.org)

## Support

For issues with the Mocha platform:
- Documentation: https://docs.getmocha.com
- Support: Contact through Mocha dashboard

For application-specific questions:
- Review this documentation
- Check the README.md
- Inspect browser console for errors
- Review network requests in DevTools
