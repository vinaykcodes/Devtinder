import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { 
  Users, 
  Search, 
  MessageSquare, 
  Compass, 
  Sparkles,
  UserX,
  ShieldBan,
  AlertTriangle,
  X
} from "lucide-react";

const Connection = () => {
  const dispatch = useDispatch();
  const connectionList = useSelector((state) => state.connection?.connection);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,   // 'remove' | 'block'
    profile: null,
    isProcessing: false,
  });

  useEffect(() => {
    const fetchCon = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(addConnection(res.data.connectionList));
      } catch (err) {
        console.error("Error fetching connections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!connectionList) {
      fetchCon();
    }
  }, [connectionList, dispatch]);

  // Open confirmation modal
  const openConfirm = (action, profile) => {
    setConfirmModal({ isOpen: true, action, profile, isProcessing: false });
  };

  // Close confirmation modal
  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, action: null, profile: null, isProcessing: false });
  };

  // Handle confirmed action
  const handleConfirmedAction = async () => {
    const { action, profile } = confirmModal;
    if (!profile) return;

    setConfirmModal((prev) => ({ ...prev, isProcessing: true }));

    try {
      const targetUserId = profile._id || profile.id;

      if (!targetUserId) {
        alert("Could not determine user ID from profile. Please refresh the page.");
        return;
      }

      if (action === "remove") {
        await axios.post(`${BASE_URL}/req/remove/${targetUserId}`, {}, { withCredentials: true });
      } else if (action === "block") {
        await axios.post(`${BASE_URL}/req/block/${targetUserId}`, {}, { withCredentials: true });
      }

      // Remove from Redux connection state
      const updatedList = (connectionList || []).filter(
        (c) => (c._id || c.id) !== targetUserId
      );
      dispatch(addConnection(updatedList));
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || err.message || "Something went wrong";
      console.error(`Error ${action}ing user:`, errorMsg);
      alert(`Failed to ${action} user: ${errorMsg}`);
    } finally {
      closeConfirm();
    }
  };

  if (isLoading && !connectionList) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
        <p className="mt-4 text-sm font-mono text-slate-500 dark:text-slate-400">Loading your developer network...</p>
      </div>
    );
  }

  const connections = Array.isArray(connectionList) ? connectionList : [];

  const filteredConnections = connections.filter((c) => {
    const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const about = (Array.isArray(c.about) ? c.about.join(" ") : c.about || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || about.includes(term);
  });

  return (
    <div className="py-4 sm:py-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight sm:text-3xl">
              Developer Connections
            </h1>
            <span className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-rose-600 dark:text-rose-300">
              <Users className="h-3.5 w-3.5" />
              {connections.length} Connected
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">
            Collaborate, build projects, and exchange ideas with your coding network.
          </p>
        </div>

        {/* Live Search Input */}
        {connections.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or tech stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/90 py-2 pl-10 pr-4 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-md transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {connections.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-rose-200/40 dark:border-white/5 bg-white dark:bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-xl shadow-black/[0.05]">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-600/10 border border-rose-500/20">
            <Users className="h-12 w-12 text-rose-500" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-pink-500 animate-bounce" />
          </div>

          <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">No Connections Yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-800 dark:text-slate-400">
            Start swiping on the feed to discover awesome developers and build your coding network!
          </p>

          <Link
            to="/feed"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:scale-105"
          >
            <Compass className="h-4 w-4" />
            Explore Developer Feed
          </Link>
        </div>
      ) : filteredConnections.length === 0 ? (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400">
          <p className="text-base font-semibold text-black dark:text-slate-300">No developers matching "{searchTerm}"</p>
          <p className="mt-1 text-xs">Try searching for a different name or technology.</p>
        </div>
      ) : (
        /* Connections Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredConnections.map((profile, idx) => {
            const avatarUrl =
              profile.photourl ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`;

            const skills = Array.isArray(profile.about)
              ? profile.about
              : typeof profile.about === "string" && profile.about.includes(",")
              ? profile.about.split(",").map((s) => s.trim()).slice(0, 4)
              : ["Full Stack", "React"];

            return (
              <div
                key={profile._id ?? profile.id ?? idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-xl shadow-black/[0.07] dark:shadow-rose-950/20 transition-all duration-300 hover:border-pink-400/50 hover:-translate-y-1 hover:shadow-black/10 backdrop-blur-xl"
              >
                <div>
                  {/* Top Avatar + Details */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-rose-200/60 dark:border-white/20">
                      <img
                        src={avatarUrl}
                        alt={profile.firstName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80`;
                        }}
                      />
                      <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-lg font-bold text-black dark:text-white group-hover:text-rose-500 dark:group-hover:text-pink-400 transition">
                        {profile.firstName} {profile.lastName || ""}
                      </h4>
                      <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
                        {profile.age ? `${profile.age} yrs • Developer` : "Developer"}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Connected
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-mono text-blue-600 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio snippet */}
                  {profile.about && (
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-800 dark:text-slate-400">
                      {Array.isArray(profile.about) ? profile.about.join(", ") : profile.about}
                    </p>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 pt-4 border-t border-rose-100 dark:border-white/5 space-y-3">
                  {/* Message Button — full width */}
                  <a
                    href={`mailto:${profile.emailID || "dev@devtinder.io"}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/60 dark:border-white/10 bg-rose-50/60 dark:bg-slate-950/80 px-4 py-2.5 text-sm font-medium text-black dark:text-slate-200 transition hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-white"
                  >
                    <MessageSquare className="h-4 w-4 text-rose-500" />
                    Message
                  </a>

                  {/* Remove & Block row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openConfirm("remove", profile)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-orange-300/50 dark:border-orange-500/20 bg-orange-50/60 dark:bg-orange-950/30 px-3 py-2 text-xs font-medium text-orange-600 dark:text-orange-400 transition hover:border-orange-500 hover:bg-orange-500/15 hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer"
                      title="Remove connection"
                    >
                      <UserX className="h-4 w-4" />
                      Remove
                    </button>

                    <button
                      onClick={() => openConfirm("block", profile)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-red-300/50 dark:border-red-500/20 bg-red-50/60 dark:bg-red-950/30 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 transition hover:border-red-500 hover:bg-red-500/15 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                      title="Block user"
                    >
                      <ShieldBan className="h-4 w-4" />
                      Block
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!confirmModal.isProcessing ? closeConfirm : undefined}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-sm rounded-3xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl animate-in fade-in zoom-in-95">
            
            {/* Close Button */}
            <button
              onClick={closeConfirm}
              disabled={confirmModal.isProcessing}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-white transition cursor-pointer disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
              confirmModal.action === "block"
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-orange-500/10 border border-orange-500/20"
            }`}>
              <AlertTriangle className={`h-8 w-8 ${
                confirmModal.action === "block" ? "text-red-500" : "text-orange-500"
              }`} />
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-bold text-black dark:text-white">
              {confirmModal.action === "block" ? "Block this Developer?" : "Remove Connection?"}
            </h3>

            {/* Description */}
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
              {confirmModal.action === "block" ? (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold text-black dark:text-white">
                    {confirmModal.profile?.firstName} {confirmModal.profile?.lastName || ""}
                  </span>
                  ? They won't be able to see your profile or send you requests.
                </>
              ) : (
                <>
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-black dark:text-white">
                    {confirmModal.profile?.firstName} {confirmModal.profile?.lastName || ""}
                  </span>
                  {" "}from your connections? You can reconnect later from the feed.
                </>
              )}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={closeConfirm}
                disabled={confirmModal.isProcessing}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-black dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                disabled={confirmModal.isProcessing}
                className={`flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                  confirmModal.action === "block"
                    ? "bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/25 hover:shadow-red-500/40"
                    : "bg-gradient-to-r from-orange-600 to-orange-500 shadow-orange-500/25 hover:shadow-orange-500/40"
                }`}
              >
                {confirmModal.isProcessing
                  ? "Processing..."
                  : confirmModal.action === "block"
                  ? "Yes, Block"
                  : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Connection;
