import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Flame } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthChecked } = useSelector((store) => store.user);

  // If auth status is still being checked after a page refresh, show loading screen
  if (!isAuthChecked) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 shadow-xl shadow-rose-500/25 animate-pulse">
          <Flame className="h-8 w-8 text-white animate-bounce" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Verifying developer session...</p>
        </div>
      </div>
    );
  }

  // If auth has finished checking and user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;