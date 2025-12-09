import type { Activity } from "@/shared/types";

/**
 * Sample seed data for development and testing
 */

export interface SeedActivity {
  title: string;
  category: string;
  minutes: number;
  start_minute?: number;
}

export const sampleDayActivities: SeedActivity[] = [
  { title: "Sleep", category: "Sleep", minutes: 480, start_minute: 0 },
  { title: "Morning routine", category: "Personal", minutes: 60, start_minute: 480 },
  { title: "Commute to work", category: "Commute", minutes: 30, start_minute: 540 },
  { title: "Morning standup", category: "Work", minutes: 15, start_minute: 570 },
  { title: "Deep work - coding", category: "Work", minutes: 120, start_minute: 585 },
  { title: "Lunch break", category: "Meals", minutes: 45, start_minute: 705 },
  { title: "Email and meetings", category: "Work", minutes: 90, start_minute: 750 },
  { title: "Afternoon coding session", category: "Work", minutes: 135, start_minute: 840 },
  { title: "Commute home", category: "Commute", minutes: 30, start_minute: 975 },
  { title: "Gym workout", category: "Exercise", minutes: 75, start_minute: 1005 },
  { title: "Dinner", category: "Meals", minutes: 45, start_minute: 1080 },
  { title: "Online course", category: "Learning", minutes: 60, start_minute: 1125 },
  { title: "Netflix", category: "Entertainment", minutes: 90, start_minute: 1185 },
  { title: "Reading before bed", category: "Personal", minutes: 30, start_minute: 1275 },
  { title: "Evening routine", category: "Personal", minutes: 45, start_minute: 1305 },
  { title: "Night sleep", category: "Sleep", minutes: 90, start_minute: 1350 },
];

export const workDayActivities: SeedActivity[] = [
  { title: "Sleep", category: "Sleep", minutes: 450, start_minute: 0 },
  { title: "Morning routine", category: "Personal", minutes: 45, start_minute: 450 },
  { title: "Breakfast", category: "Meals", minutes: 20, start_minute: 495 },
  { title: "Commute", category: "Commute", minutes: 35, start_minute: 515 },
  { title: "Work - emails", category: "Work", minutes: 60, start_minute: 550 },
  { title: "Work - project A", category: "Work", minutes: 150, start_minute: 610 },
  { title: "Lunch", category: "Meals", minutes: 60, start_minute: 760 },
  { title: "Work - meetings", category: "Work", minutes: 120, start_minute: 820 },
  { title: "Work - project B", category: "Work", minutes: 120, start_minute: 940 },
  { title: "Commute home", category: "Commute", minutes: 40, start_minute: 1060 },
  { title: "Exercise", category: "Exercise", minutes: 60, start_minute: 1100 },
  { title: "Dinner prep & eating", category: "Meals", minutes: 75, start_minute: 1160 },
  { title: "Family time", category: "Personal", minutes: 90, start_minute: 1235 },
  { title: "TV/relaxation", category: "Entertainment", minutes: 60, start_minute: 1325 },
  { title: "Bedtime routine", category: "Personal", minutes: 25, start_minute: 1385 },
  { title: "Sleep start", category: "Sleep", minutes: 30, start_minute: 1410 },
];

export const weekendActivities: SeedActivity[] = [
  { title: "Sleep in", category: "Sleep", minutes: 540, start_minute: 0 },
  { title: "Lazy morning", category: "Personal", minutes: 90, start_minute: 540 },
  { title: "Brunch", category: "Meals", minutes: 60, start_minute: 630 },
  { title: "Grocery shopping", category: "Personal", minutes: 90, start_minute: 690 },
  { title: "Hobby project", category: "Personal", minutes: 180, start_minute: 780 },
  { title: "Lunch", category: "Meals", minutes: 45, start_minute: 960 },
  { title: "Nature walk", category: "Exercise", minutes: 90, start_minute: 1005 },
  { title: "Learning new skill", category: "Learning", minutes: 120, start_minute: 1095 },
  { title: "Dinner with friends", category: "Meals", minutes: 120, start_minute: 1215 },
  { title: "Movie night", category: "Entertainment", minutes: 135, start_minute: 1335 },
  { title: "Wind down", category: "Personal", minutes: 30, start_minute: 1470 },
];

/**
 * Helper to seed activities for a specific date
 */
export async function seedActivitiesForDate(
  date: string,
  activities: SeedActivity[]
): Promise<void> {
  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  
  if (totalMinutes !== 1440) {
    console.warn(`Warning: Total minutes (${totalMinutes}) does not equal 1440`);
  }

  for (const activity of activities) {
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activity,
          date,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to seed activity "${activity.title}":`, error);
      }
    } catch (error) {
      console.error(`Error seeding activity "${activity.title}":`, error);
    }
  }
}

/**
 * Helper to clear all activities for a date
 */
export async function clearActivitiesForDate(date: string): Promise<void> {
  try {
    const response = await fetch(`/api/activities/${date}`);
    if (!response.ok) return;
    
    const activities: Activity[] = await response.json();
    
    for (const activity of activities) {
      await fetch(`/api/activities/${activity.id}`, {
        method: "DELETE",
      });
    }
  } catch (error) {
    console.error("Error clearing activities:", error);
  }
}
