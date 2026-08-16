import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { removeConnection } from "../utils/connectionSlice";
import { removeReq } from "../utils/requestSlice";
import { removefeed } from "../utils/feedSlice";
import { 
  Flame, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles
} from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailID, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user?.user);

  useEffect(() => {
    if (currentUser) {
      navigate("/feed", { replace: true });
    }
  }, [currentUser, navigate]);

  const clearStaleData = () => {
    dispatch(removeConnection());
    dispatch(removeReq());
    dispatch(removefeed());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const payload = { emailID, password };
        const res = await axios.post(`${BASE_URL}/login`, payload, {
          withCredentials: true,
        });
        clearStaleData();
        dispatch(addUser(res.data));
        navigate("/feed");
      } else {
        const payload = { emailID, password, firstName, lastName };
        const res = await axios.post(`${BASE_URL}/signin`, payload, {
          withCredentials: true,
        });
        clearStaleData();
        dispatch(addUser(res.data));
        navigate("/profile");
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message);
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Authentication failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center py-6 px-4">
      <div className="relative w-full max-w-md">
        
        {/* Glow ambient background aura (Pink + Red + Blue) */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 opacity-25 blur-xl transition-all duration-500" />

        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/85 p-6 sm:p-8 shadow-2xl shadow-black/10 dark:shadow-rose-950/40 backdrop-blur-2xl transition-colors duration-300">
          
          {/* Brand header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 shadow-xl shadow-rose-500/25">
              <Flame className="h-7 w-7 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight sm:text-3xl">
              {isLogin ? "Welcome Back" : "Join DevTinder"}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-400">
              {isLogin
                ? "Connect with developers building the future"
                : "Create your dev profile and start matching"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mb-6 flex rounded-2xl border border-rose-200/50 dark:border-white/10 bg-rose-50/60 dark:bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 rounded-xl py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isLogin
                  ? "bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-slate-800 dark:text-slate-400 hover:text-rose-500 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 rounded-xl py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                !isLogin
                  ? "bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-slate-800 dark:text-slate-400 hover:text-rose-500 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Fields for Sign Up */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-slate-400">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ada"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-slate-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Lovelace"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 py-2.5 px-3 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="dev@example.com"
                  value={emailID}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 py-2.5 pl-10 pr-10 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button (Pink + Red + Blue Gradient) */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Feed" : "Create Developer Account"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Footer Switch */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-xs text-slate-500 dark:text-slate-400 transition hover:text-rose-500 dark:hover:text-pink-400 cursor-pointer"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span className="font-semibold text-rose-500 dark:text-pink-400 underline decoration-pink-500/50 underline-offset-4">Sign up now</span>
                </>
              ) : (
                <>
                  Already registered? <span className="font-semibold text-rose-500 dark:text-pink-400 underline decoration-pink-500/50 underline-offset-4">Sign in here</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;


