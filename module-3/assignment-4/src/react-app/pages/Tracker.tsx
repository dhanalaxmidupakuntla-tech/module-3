import { useState } from "react";
import Navbar from "@/react-app/components/Navbar";
import ActivityForm from "@/react-app/components/ActivityForm";
import ActivityList from "@/react-app/components/ActivityList";
import DatePicker from "@/react-app/components/DatePicker";
import AnalyticsDashboard from "@/react-app/components/AnalyticsDashboard";
import { useActivities } from "@/react-app/hooks/useActivities";
import { getTodayDate } from "@/react-app/utils/timeUtils";

export default function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { activities, totalMinutes, remainingMinutes, addActivity, updateActivity, deleteActivity, isLoading } = useActivities(selectedDate);

  const canAnalyze = remainingMinutes === 0 && totalMinutes === 1440;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <ActivityForm
                selectedDate={selectedDate}
                onActivityAdded={addActivity}
                remainingMinutes={remainingMinutes}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Day Progress</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-indigo-600">
                      {totalMinutes}
                    </span>
                    <span className="text-gray-500">/ 1440 min</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    {/* eslint-disable-next-line */}
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${(totalMinutes / 1440) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Remaining</div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${remainingMinutes === 0 ? 'text-green-600' : 'text-purple-600'}`}>
                      {remainingMinutes}
                    </span>
                    <span className="text-gray-500">minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  disabled={!canAnalyze}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    canAnalyze
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {showAnalytics ? 'Hide Analytics' : 'Analyze Day'}
                </button>
                {!canAnalyze && totalMinutes > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    Complete all 1440 minutes to analyze
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showAnalytics ? (
              <AnalyticsDashboard
                activities={activities}
                selectedDate={selectedDate}
              />
            ) : (
              <ActivityList
                activities={activities}
                onUpdate={updateActivity}
                onDelete={deleteActivity}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}