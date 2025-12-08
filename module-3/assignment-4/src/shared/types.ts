import z from "zod";

export const ActivitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  activity_date: z.string(),
  title: z.string(),
  category: z.string(),
  minutes: z.number(),
  start_minute: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export interface CategoryData {
  category: string;
  minutes: number;
  hours: number;
}

export interface AnalyticsData {
  totalMinutes: number;
  totalHours: number;
  categoryData: CategoryData[];
  activities: Activity[];
}