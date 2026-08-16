import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { removeReq } from "../utils/requestSlice";
import { removefeed } from "../utils/feedSlice";
import { 
  Flame, 
  Code2, 
  Users, 
  UserCheck, 
  Compass, 
  User, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state.user?.user);
  const requests = useSelector((state) => state.request?.request);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dark / Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("devtinder_theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("devtinder_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const requestCount = Array.isArray(requests) ? requests.length : 0;

  const clearAllUserData = () => {
    dispatch(removeUser());
    dispatch(removeConnection());
    dispatch(removeReq());
    dispatch(removefeed());
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      clearAllUserData();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      clearAllUserData();
      navigate("/login");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo (Pink + Red + Blue Fusion) */}
        <Link 
          to={user ? "/feed" : "/login"} 
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 shadow-lg shadow-rose-500/25">
            <Flame className="h-6 w-6 text-white transition-transform group-hover:scale-110 group-hover:rotate-6" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-md bg-slate-900 dark:bg-slate-900 bg-white border border-rose-200 dark:border-white/20">
              <Code2 className="h-2.5 w-2.5 text-pink-500 dark:text-pink-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="text-[#1a1035] dark:text-white">Dev</span>
              <span className="text-gradient-tri">Tinder</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-rose-400 dark:text-slate-400 uppercase -mt-1 hidden sm:block">
              Match • Code • Collab
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        {user && (
          <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/60 p-1.5 backdrop-blur-md shadow-lg shadow-black/[0.06]">
            <Link
              to="/feed"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/feed")
                  ? "bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-black dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-white/5 hover:text-rose-600 dark:hover:text-white"
              }`}
            >
              <Compass className="h-4 w-4" />
              Feed
            </Link>

            <Link
              to="/connections"
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/connections")
                  ? "bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-black dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-white/5 hover:text-rose-600 dark:hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Connections
            </Link>

            <Link
              to="/conrequest"
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/conrequest") || isActive("/Conrequest")
                  ? "bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-black dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-white/5 hover:text-rose-600 dark:hover:text-white"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Requests
              {requestCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1.5 text-[11px] font-bold text-white shadow-sm shadow-pink-500/50 animate-pulse">
                  {requestCount}
                </span>
              )}
            </Link>
          </nav>
        )}

        {/* Right Section: Theme Toggle + User Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/80 text-black dark:text-slate-200 shadow-md shadow-black/[0.06] transition-all duration-300 hover:scale-110 hover:border-pink-500/40 hover:shadow-pink-500/20 focus:outline-none cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600 transition-transform duration-300 rotate-0 hover:-rotate-45" />
            )}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="group flex items-center gap-3 rounded-full border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/80 p-1.5 pr-3 shadow-md shadow-black/[0.06] transition-all duration-200 hover:border-pink-500/40 hover:bg-rose-50/60 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              >
                {/* User Avatar with dynamic ring */}
                <div className="relative">
                  <img
                    src={user.photourl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.firstName || "dev"}`}
                    alt={user.firstName}
                    className="h-10 w-10 rounded-full object-cover border-2 border-rose-200/60 dark:border-white/20"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.firstName || "dev"}`;
                    }}
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-black dark:text-white group-hover:text-rose-500 dark:group-hover:text-pink-400 transition">
                    {user.firstName} {user.lastName || ""}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {user.age ? `${user.age} yrs` : "Developer"}
                  </p>
                </div>

                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180 text-pink-500" : ""}`} />
              </button>

              {/* Animated Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-rose-200/60 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl shadow-rose-500/10 dark:shadow-slate-950/80 backdrop-blur-2xl transition-all duration-150 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-rose-100 dark:border-white/10 mb-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-rose-400 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-black dark:text-white truncate">{user.firstName} {user.lastName}</p>
                    {user.emailID && <p className="text-xs text-rose-500 dark:text-pink-400 truncate">{user.emailID}</p>}
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-black dark:text-slate-200 transition hover:bg-rose-50 dark:hover:bg-pink-500/10 hover:text-rose-600 dark:hover:text-white"
                    >
                      <span className="flex items-center gap-2.5">
                        <User className="h-4 w-4 text-pink-500" />
                        Edit Profile
                      </span>
                      <span className="rounded-full bg-gradient-to-r from-rose-500/15 to-pink-500/15 px-2 py-0.5 text-[10px] font-mono text-rose-600 dark:text-pink-300 border border-rose-300 dark:border-pink-500/30">
                        Pro
                      </span>
                    </Link>

                    <Link
                      to="/feed"
                      onClick={() => setMenuOpen(false)}
                      className="flex md:hidden items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-black dark:text-slate-200 transition hover:bg-rose-50 dark:hover:bg-pink-500/10 hover:text-rose-600 dark:hover:text-white"
                    >
                      <Compass className="h-4 w-4 text-blue-500" />
                      Explore Feed
                    </Link>

                    <Link
                      to="/connections"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-black dark:text-slate-200 transition hover:bg-rose-50 dark:hover:bg-pink-500/10 hover:text-rose-600 dark:hover:text-white"
                    >
                      <Users className="h-4 w-4 text-emerald-500" />
                      Connections
                    </Link>

                    <Link
                      to="/conrequest"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-black dark:text-slate-200 transition hover:bg-rose-50 dark:hover:bg-pink-500/10 hover:text-rose-600 dark:hover:text-white"
                    >
                      <span className="flex items-center gap-2.5">
                        <UserCheck className="h-4 w-4 text-rose-500" />
                        Requests
                      </span>
                      {requestCount > 0 && (
                        <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {requestCount}
                        </span>
                      )}
                    </Link>

                    <div className="my-1 border-t border-rose-100 dark:border-white/10" />

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 p-[1px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105"
              >
                <span className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-950 px-5 py-2 text-sm text-black dark:text-white transition duration-300 hover:bg-opacity-0 hover:text-white">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  Sign In / Register
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


