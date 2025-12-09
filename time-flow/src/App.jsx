import React from "react";
import { AuthProvider } from "./lib/auth";
import Router from "./pages/Router";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Router />
      </div>
    </AuthProvider>
  );
}
