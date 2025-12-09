import { useAuth } from "@getmocha/users-service/react";
import { Clock, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TimeFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.google_user_data.picture && (
                <img
                  src={user.google_user_data.picture}
                  alt={user.google_user_data.name || "User"}
                  className="w-8 h-8 rounded-full border-2 border-indigo-200"
                />
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.google_user_data.name || user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
