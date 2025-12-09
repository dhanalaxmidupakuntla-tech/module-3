# TimeFlow - AI-Powered Daily Time Tracking & Analytics Dashboard

TimeFlow is a beautiful, modern web application for tracking and analyzing how you spend your time each day. Log activities with precision, visualize your time distribution, and gain insights into your daily patterns.

## Features

- **User Authentication**: Secure Google OAuth sign-in powered by Mocha Users Service
- **Activity Tracking**: Log daily activities with title, category, duration, and optional start time
- **1440-Minute Validation**: Ensures daily activities don't exceed 24 hours (1440 minutes)
- **Real-time Updates**: Activities update automatically across all components
- **Visual Analytics**: Beautiful charts showing time distribution by category and activity
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Built with Tailwind CSS featuring gradients, smooth transitions, and polished components

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Backend**: Cloudflare Workers with Hono framework
- **Database**: Cloudflare D1 (SQLite)
- **Authentication**: Mocha Users Service (Google OAuth)
- **Deployment**: Cloudflare infrastructure

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Mocha account

### Installation

1. Clone the repository or create a new Mocha app with this code

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the development URL shown in the terminal

## Project Structure

```
src/
├── react-app/
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── ActivityForm.tsx        # Form to add new activities
│   │   ├── ActivityList.tsx        # List and edit activities
│   │   ├── DatePicker.tsx          # Date selection component
│   │   ├── AnalyticsDashboard.tsx  # Main analytics view
│   │   ├── ChartPie.tsx           # Pie chart for categories
│   │   ├── ChartBar.tsx           # Bar chart for activities
│   │   └── NoDataCard.jsx         # Empty state component
│   ├── pages/
│   │   ├── Login.tsx              # Login page
│   │   ├── AuthCallback.tsx       # OAuth callback handler
│   │   └── Tracker.tsx            # Main tracker page
│   ├── hooks/
│   │   └── useActivities.ts       # Activity management hook
│   ├── utils/
│   │   ├── timeUtils.ts           # Time formatting utilities
│   │   └── analytics.ts           # Analytics calculations
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Entry point
├── worker/
│   └── index.ts                   # API routes and backend logic
└── shared/
    └── types.ts                   # Shared TypeScript types
```

## Usage

### Adding Activities

1. Select a date using the date picker
2. Fill in the activity form:
   - **Title**: Name of the activity
   - **Category**: Choose from predefined categories (Work, Personal, Sleep, etc.)
   - **Minutes**: Duration of the activity
   - **Start Minute** (optional): Minute of the day when activity started (0-1439)
3. Click "Add Activity"

### Viewing Analytics

Once you've logged all 1440 minutes for a day:
1. The "Analyze Day" button becomes enabled
2. Click it to view comprehensive analytics including:
   - Total time breakdown
   - Category distribution (pie chart)
   - Activity durations (bar chart)
   - Detailed category percentages

### Editing and Deleting

- Click the edit icon on any activity to modify it
- Click the trash icon to delete an activity
- Changes are saved automatically and reflected instantly

## Database Schema

The app uses a single `activities` table:

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

## API Endpoints

### Authentication
- `GET /api/oauth/google/redirect_url` - Get OAuth login URL
- `POST /api/sessions` - Exchange OAuth code for session
- `GET /api/users/me` - Get current user
- `GET /api/logout` - Sign out

### Activities
- `GET /api/activities/:date` - Get activities for a date
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

## AI Usage & Development

This application was built with assistance from Mocha's AI agent following a comprehensive specification. Here's what the AI handled:

### Architecture & Setup
- **Tech Stack Selection**: Chose React 18 + TypeScript + Vite + Tailwind CSS for optimal performance
- **Database Design**: Created SQLite/D1 schema optimized for time tracking with proper indexes
- **Authentication Integration**: Implemented secure Google OAuth via Mocha Users Service
- **API Design**: Built RESTful Hono-based API with proper validation and error handling

### Frontend Development
- **Component Architecture**: Created modular, reusable components following React best practices
  - Page components (Login, AuthCallback, Tracker) act as controllers
  - UI components (Navbar, ActivityForm, ActivityList, etc.) are pure presentational
  - Custom hooks (useActivities) manage data fetching and state
- **Responsive Design**: Built mobile-first layouts that scale beautifully to desktop
- **Data Visualization**: Integrated Recharts for pie and bar charts showing time distribution
- **State Management**: Implemented real-time updates using React hooks and context

### Backend Development
- **API Routes**: Created CRUD endpoints for activities with proper authentication
- **Validation**: Used Zod schemas to ensure data integrity (daily limit of 1440 minutes)
- **Security**: Implemented user-scoped queries, SQL injection prevention, secure sessions
- **Performance**: Added database indexes and optimized queries for fast response times

### User Experience
- **Visual Design**: Applied modern design principles with gradients, shadows, and smooth transitions
- **Color Theory**: Selected complementary color palette (indigo/purple gradient theme)
- **Typography**: Used system fonts for optimal performance and readability
- **Icons**: Integrated Lucide React for consistent, beautiful iconography
- **Empty States**: Created helpful no-data cards to guide users

### Developer Experience
- **TypeScript**: Full type safety across frontend and backend
- **Code Organization**: Logical file structure with clear separation of concerns
- **Utility Functions**: Created helpers for time formatting, analytics, and seeding
- **Documentation**: Comprehensive README, SETUP.md, and inline code comments
- **Seed Data**: Provided sample datasets for development and testing

### Key Features Implemented
1. ✅ User authentication with Google OAuth
2. ✅ Activity tracking with title, category, duration, and optional start time
3. ✅ 1440-minute daily validation (24 hours)
4. ✅ Real-time activity list with edit/delete
5. ✅ Visual analytics with pie and bar charts
6. ✅ Category-based time distribution analysis
7. ✅ Date picker for viewing different days
8. ✅ Responsive design for all screen sizes
9. ✅ Seed data utilities for testing
10. ✅ Complete setup and deployment documentation

### Adaptation from Specification
The original specification requested Firebase Auth + Firestore. The AI adapted this to:
- **Firebase Auth → Mocha Users Service**: Provides the same Google OAuth functionality with managed infrastructure
- **Firestore → Cloudflare D1**: SQLite-based database that's faster and simpler for this use case
- **Firebase Hosting → Cloudflare Workers**: Edge deployment for global low-latency access

All requested functionality was preserved while optimizing for the Mocha platform's strengths.

## Deployment

This app is ready to deploy on Mocha's platform. Simply publish your app through the Mocha interface to make it live.

## Contributing

This is a starter template. Feel free to customize it for your needs:

- Add new activity categories
- Customize the color scheme
- Add more analytics views
- Implement data export features
- Add recurring activities
- Create weekly/monthly reports

## License

MIT License - feel free to use this code for your own projects.

## Support

For issues or questions about the Mocha platform, visit [docs.getmocha.com](https://docs.getmocha.com)
