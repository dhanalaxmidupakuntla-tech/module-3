import React from "react";
import LoginPage from "./auth/Login";
import TrackerPage from "./tracker/Tracker";
import DashboardPage from "./dashboard/Dashboard";
import { useAuth } from "../lib/auth";

export default function Router() {
  // call hooks first (always)
  const { user, ready } = useAuth();
  const [page, setPage] = React.useState("tracker");

  // then handle loading / redirects / early returns
  if (!ready) return <div className="center">Loading...</div>;
  if (!user) return <LoginPage />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
        <div style={{ fontWeight: 700 }}>TimeFlow</div>
        <nav>
          <button onClick={() => setPage("tracker")} className="nav-btn">Tracker</button>
          <button onClick={() => setPage("dashboard")} className="nav-btn">Dashboard</button>
        </nav>
      </div>
      <div style={{ padding: 16 }}>
        {page === "tracker" ? <TrackerPage /> : <DashboardPage />}
      </div>
    </div>
  );
}
