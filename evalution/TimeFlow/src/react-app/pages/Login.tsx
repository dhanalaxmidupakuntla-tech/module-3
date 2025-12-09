import { useAuth } from "@getmocha/users-service/react";
import { Navigate } from "react-router";
import { Clock, TrendingUp, PieChart } from "lucide-react";

export default function LoginPage() {
  const { user, isPending, redirectToLogin } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              TimeFlow
            </h1>
            <p className="text-xl text-gray-600">
              AI-Powered Daily Time Tracking & Analytics Dashboard
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Track Every Minute</h3>
                <p className="text-gray-600">
                  Log your daily activities with precision and never lose track of how you spend your time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Visual Analytics</h3>
                <p className="text-gray-600">
                  Beautiful charts and insights to understand your time distribution across categories
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Optimize Your Day</h3>
                <p className="text-gray-600">
                  Identify patterns and make data-driven decisions to improve your productivity
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={redirectToLogin}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign in with Google
          </button>
        </div>

        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-indigo-600">1440</div>
                    <div className="text-gray-600 mt-2">Minutes in a day</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Work", "Personal", "Sleep", "Exercise"].map((cat, i) => (
                    <div key={cat} className="flex items-center gap-3">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                        style={{ width: `${85 - i * 15}%` }}
                      ></div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
