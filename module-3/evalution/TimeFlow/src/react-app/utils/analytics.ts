import type { Activity, AnalyticsData, CategoryData } from "@/shared/types";

/**
 * Generate analytics data from activities
 */
export function getAnalyticsData(activities: Activity[]): AnalyticsData {
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.minutes, 0);
  const totalHours = totalMinutes / 60;

  // Group by category
  const categoryMap = new Map<string, number>();
  
  activities.forEach((activity) => {
    const current = categoryMap.get(activity.category) || 0;
    categoryMap.set(activity.category, current + activity.minutes);
  });

  const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(
    ([category, minutes]) => ({
      category,
      minutes,
      hours: minutes / 60,
    })
  );

  return {
    totalMinutes,
    totalHours,
    categoryData,
    activities,
  };
}

/**
 * Get summary statistics for a day
 */
export function getDaySummary(activities: Activity[]) {
  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  const isComplete = totalMinutes === 1440;
  const remainingMinutes = 1440 - totalMinutes;
  const categoryCount = new Set(activities.map(a => a.category)).size;
  
  return {
    totalMinutes,
    totalHours: totalMinutes / 60,
    remainingMinutes,
    isComplete,
    activityCount: activities.length,
    categoryCount,
  };
}

/**
 * Get top activities by duration
 */
export function getTopActivities(activities: Activity[], limit: number = 5): Activity[] {
  return [...activities]
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit);
}

/**
 * Calculate percentage of time spent on a category
 */
export function getCategoryPercentage(categoryMinutes: number, totalMinutes: number): number {
  if (totalMinutes === 0) return 0;
  return (categoryMinutes / totalMinutes) * 100;
}

/**
 * Get activity count by category
 */
export function getActivityCountByCategory(activities: Activity[]): Map<string, number> {
  const countMap = new Map<string, number>();
  
  activities.forEach((activity) => {
    const current = countMap.get(activity.category) || 0;
    countMap.set(activity.category, current + 1);
  });

  return countMap;
}
