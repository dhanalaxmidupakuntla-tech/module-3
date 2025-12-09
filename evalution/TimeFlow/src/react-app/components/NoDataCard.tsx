import { Calendar, ArrowLeft } from "lucide-react";

export default function NoDataCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <Calendar className="w-10 h-10 text-indigo-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Activities Yet
          </h3>
          <p className="text-gray-600">
            Start tracking your time by adding activities for this date. You'll be able to analyze your day once you've logged all 1440 minutes.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Use the form on the left to add your first activity</span>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">1440</div>
              <div className="text-xs text-gray-500 mt-1">Minutes per day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-xs text-gray-500 mt-1">Hours per day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">∞</div>
              <div className="text-xs text-gray-500 mt-1">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
