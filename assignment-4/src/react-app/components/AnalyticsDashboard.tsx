import type { Activity } from "@/shared/types";
import { getAnalyticsData } from "@/react-app/utils/analytics";
import ChartPie from "./ChartPie";
import ChartBar from "./ChartBar";
import { Clock, TrendingUp, List } from "lucide-react";

interface AnalyticsDashboardProps {
  activities: Activity[];
  selectedDate: string;
}

export default function AnalyticsDashboard({ activities, selectedDate }: AnalyticsDashboardProps) {
  const analytics = getAnalyticsData(activities);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">{formatDate(selectedDate)}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Day Complete</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Time</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {analytics.totalHours.toFixed(1)}
              </span>
              <span className="text-gray-600">hours</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {analytics.totalMinutes} minutes logged
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Categories</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {analytics.categoryData.length}
              </span>
              <span className="text-gray-600">tracked</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Different activity types
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <List className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Activities</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {analytics.activities.length}
              </span>
              <span className="text-gray-600">total</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Logged for this day
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Time by Category
            </h3>
            <ChartPie data={analytics.categoryData} />
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Durations
            </h3>
            <ChartBar activities={analytics.activities} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {analytics.categoryData
              .sort((a, b) => b.minutes - a.minutes)
              .map((cat) => (
                <div key={cat.category} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{cat.category}</span>
                      <span className="text-sm text-gray-600">
                        {cat.hours.toFixed(1)}h ({cat.minutes}m)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      {/* eslint-disable-next-line */}
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${(cat.minutes / 1440) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {((cat.minutes / 1440) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
