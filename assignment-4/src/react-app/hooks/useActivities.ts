import { useState, useEffect, useCallback } from "react";
import type { Activity } from "@/shared/types";

export function useActivities(selectedDate: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(1440);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/activities/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
        
        const total = data.reduce((sum: number, activity: Activity) => sum + activity.minutes, 0);
        setTotalMinutes(total);
        setRemainingMinutes(1440 - total);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (activityData: any) => {
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add activity");
    }

    await fetchActivities();
  };

  const updateActivity = async (id: number, data: any) => {
    const response = await fetch(`/api/activities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update activity");
    }

    await fetchActivities();
  };

  const deleteActivity = async (id: number) => {
    const response = await fetch(`/api/activities/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete activity");
    }

    await fetchActivities();
  };

  return {
    activities,
    totalMinutes,
    remainingMinutes,
    isLoading,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}
