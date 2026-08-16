import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addReq } from "../utils/requestSlice";
import axios from "axios";
import confetti from "canvas-confetti";
import { 
  Check, 
  X, 
  Sparkles, 
  Inbox, 
  Compass
} from "lucide-react";
import { Link } from "react-router-dom";

const ConnectionReq = () => {
  const req = useSelector((state) => state.request?.request);
  const dispatch = useDispatch();
  const [processingId, setProcessingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestAction = async (action, id) => {
    setProcessingId(id);

    if (action === "accepted") {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#3b82f6", "#f43f5e", "#ec4899", "#10b981"],
      });
    }

    try {
      await axios.post(
        `${BASE_URL}/req/review/${action}/${id}`,
        {},
        { withCredentials: true }
      );

      const updatedReq = req.filter((item) => {
        const itemId = item._id || item.id || item.userId || item.email;
        return itemId !== id;
      });

      dispatch(addReq(updatedReq));
    } catch (err) {
      console.error("Error reviewing request:", err.response?.data || err.message);
      const updatedReq = req.filter((item) => {
        const itemId = item._id || item.id || item.userId || item.email;
        return itemId !== id;
      });
      dispatch(addReq(updatedReq));
    } finally {
      setProcessingId(null);
    }
  };

  const fetchReq = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/req/received", {
        withCredentials: true,
      });
      dispatch(addReq(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!req) {
      fetchReq();
    }
  }, [req]);

  const requests = Array.isArray(req) ? req : [];

  if (isLoading && !req) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
        <p className="mt-4 text-sm font-mono text-slate-500 dark:text-slate-400">Loading incoming requests...</p>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight sm:text-3xl">
              Connection Requests
            </h1>
            {requests.length > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-rose-600 dark:text-rose-300">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                {requests.length} Pending
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">
            Developers who want to connect and collaborate with you.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-rose-200/40 dark:border-white/5 bg-white dark:bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-xl shadow-black/[0.05]">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-600/10 border border-rose-500/20">
            <Inbox className="h-12 w-12 text-rose-500" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-pink-500 animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">Inbox Zero</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-800 dark:text-slate-400">
            You don't have any pending connection requests right now. Keep exploring the feed!
          </p>

          <Link
            to="/feed"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:scale-105"
          >
            <Compass className="h-4 w-4" />
            Explore Developers
          </Link>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {requests.map((profile, idx) => {
            const profileId = profile._id || profile.id || profile.userId || profile.email || idx;
            const isProcessing = processingId === profile._id;

            const avatarUrl =
              profile.photourl ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`;

            const skills = Array.isArray(profile.about)
              ? profile.about
              : typeof profile.about === "string" && profile.about.includes(",")
              ? profile.about.split(",").map((s) => s.trim()).slice(0, 3)
              : ["Full Stack", "Developer"];

            return (
              <div
                key={profileId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-xl shadow-black/[0.07] dark:shadow-rose-950/20 transition-all duration-300 hover:border-pink-400/50 hover:shadow-black/10 backdrop-blur-xl"
              >
                <div>
                  {/* Top Avatar + Details */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-rose-200/60 dark:border-white/20">
                      <img
                        src={avatarUrl}
                        alt={profile.firstName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80`;
                        }}
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-bold text-black dark:text-white group-hover:text-rose-500 dark:group-hover:text-pink-400 transition">
                        {profile.firstName} {profile.lastName || ""}
                      </h4>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {profile.age ? `${profile.age} yrs • Developer` : "Developer"}
                      </p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center rounded-lg border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[11px] font-mono text-pink-600 dark:text-pink-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio snippet */}
                  {profile.about && (
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-800 dark:text-slate-400">
                      {Array.isArray(profile.about) ? profile.about.join(", ") : profile.about}
                    </p>
                  )}
                </div>

                {/* Accept / Decline Action Controls */}
                <div className="mt-5 pt-4 border-t border-rose-100 dark:border-white/10 grid grid-cols-2 gap-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleRequestAction("rejected", profile._id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-blue-300/50 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/10 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-50 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleRequestAction("accepted", profile._id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/25 transition hover:shadow-rose-500/40 hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ConnectionReq;


