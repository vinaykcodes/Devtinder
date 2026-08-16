import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import confetti from "canvas-confetti";
import { 
  X, 
  Heart, 
  Sparkles, 
  RefreshCw, 
  Flame,
  Hand
} from "lucide-react";

const SWIPE_THRESHOLD = 90; // Pixels required to trigger swipe action

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feed?.feed);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right' | null
  const [loadingAction, setLoadingAction] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#f43f5e", "#ec4899", "#10b981", "#fbbf24"],
    });
  };

  const handleRequestAction = async (action, id) => {
    if (loadingAction || !id) return;
    setLoadingAction(true);

    if (action === "interested") {
      setSwipeDirection("right");
      triggerConfetti();
    } else {
      setSwipeDirection("left");
    }

    // Allow animation to complete
    setTimeout(async () => {
      try {
        await axios.post(
          `${BASE_URL}/sendConnectionRequest/${action}/${id}`,
          {},
          { withCredentials: true }
        );

        const updatedReq = feedData.filter((item) => item._id !== id);
        dispatch(addfeed(updatedReq));
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        // Even on error, remove card locally to keep fluid UX
        const updatedReq = feedData.filter((item) => item._id !== id);
        dispatch(addfeed(updatedReq));
      } finally {
        setDragOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
        setLoadingAction(false);
      }
    }, 320);
  };

  const fetchFeed = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addfeed(res.data.data));
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!feedData) {
      fetchFeed();
    }
  }, [feedData]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!feedData || feedData.length === 0 || loadingAction || isDragging) return;
      const currentId = feedData[0]._id;
      if (e.key === "ArrowLeft") {
        handleRequestAction("ignored", currentId);
      } else if (e.key === "ArrowRight") {
        handleRequestAction("interested", currentId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feedData, loadingAction, isDragging]);

  // Touch and Mouse Drag Gestures
  const handleDragStart = (clientX, clientY) => {
    if (loadingAction || !feedData || feedData.length === 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
    currentPosRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    currentPosRef.current = { x: clientX, y: clientY };
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const deltaX = currentPosRef.current.x - startPosRef.current.x;
    const currentId = feedData?.[0]?._id;

    if (deltaX > SWIPE_THRESHOLD && currentId) {
      handleRequestAction("interested", currentId);
    } else if (deltaX < -SWIPE_THRESHOLD && currentId) {
      handleRequestAction("ignored", currentId);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse Listeners
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    handleDragStart(e.clientX, e.clientY);
  };

  // Touch Listeners
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    const onWindowMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleDragMove(e.clientX, e.clientY);
      }
    };
    const onWindowMouseUp = () => {
      if (isDraggingRef.current) {
        handleDragEnd();
      }
    };

    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [feedData, loadingAction]);

  // Calculate dynamic rotation and badge opacities during drag
  const rotation = isDragging ? (dragOffset.x / 18) : 0;
  const likeOpacity = Math.min(Math.max(dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const scale = isDragging ? 1.02 : 1;

  // Empty State with Animated Radar Scanner
  if (!feedData || feedData.length === 0) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
          {/* Pulsing radar rings */}
          <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-ping opacity-30" />
          <div className="absolute inset-4 rounded-full border border-pink-500/30 animate-pulse" />
          <div className="absolute inset-10 rounded-full border border-blue-500/40" />
          
          {/* Rotating radar sweep */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-rose-500/10 to-transparent animate-radar" />

          {/* Central radar icon */}
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 shadow-2xl shadow-rose-500/30">
            <Flame className="h-10 w-10 text-white animate-bounce" />
          </div>

          {/* Floating tech nodes */}
          <div className="absolute top-2 left-4 rounded-lg bg-white/95 dark:bg-slate-900/90 border border-blue-400/40 dark:border-blue-500/40 px-2 py-1 text-[10px] font-mono text-blue-600 dark:text-blue-300 animate-float shadow-lg shadow-blue-500/10">
            React
          </div>
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 dark:bg-slate-900/90 border border-rose-400/40 dark:border-rose-500/40 px-2 py-1 text-[10px] font-mono text-rose-600 dark:text-rose-300 animate-float shadow-lg shadow-rose-500/10" style={{ animationDelay: '1.5s' }}>
            Node.js
          </div>
          <div className="absolute top-8 right-2 rounded-lg bg-white/95 dark:bg-slate-900/90 border border-pink-400/40 dark:border-pink-500/40 px-2 py-1 text-[10px] font-mono text-pink-600 dark:text-pink-300 animate-float shadow-lg shadow-pink-500/10" style={{ animationDelay: '3s' }}>
            TypeScript
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-[#1a1035] dark:text-white tracking-tight sm:text-4xl">
          Radar is Clear!
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-800 dark:text-slate-400">
          You've reviewed all available developers in your area. Check back later or refresh to discover new coding partners!
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={fetchFeed}
            disabled={isFetching}
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-105 hover:shadow-rose-500/40 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            {isFetching ? "Scanning..." : "Scan Radar Again"}
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = feedData[0];
  const nextProfile = feedData[1];

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8 select-none">
      
      {/* Top Header Pill */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-rose-200/60 dark:border-white/10 bg-rose-50/80 dark:bg-slate-900/80 px-4 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-300 shadow-lg shadow-black/[0.06] backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        <span>{feedData.length} active developers nearby</span>
        <span className="hidden sm:inline-flex items-center gap-1 text-rose-400 dark:text-slate-500 pl-2 border-l border-rose-200 dark:border-white/10">
          <Hand className="h-3 w-3 text-pink-500" />
          Drag / Swipe Card
        </span>
      </div>

      {/* Deck Card Container */}
      <div className="relative w-full max-w-md">
        
        {/* Next Card Background Shadow/Peek */}
        {nextProfile && (
          <div 
            className="absolute inset-0 top-3 scale-[0.95] opacity-50 blur-[0.5px] pointer-events-none transition-all duration-200"
            style={{
              transform: `scale(${0.95 + Math.min(Math.abs(dragOffset.x) / 1000, 0.05)})`,
              opacity: 0.5 + Math.min(Math.abs(dragOffset.x) / 500, 0.3)
            }}
          >
            <UserCard data={nextProfile} />
          </div>
        )}

        {/* Current Active Card with Full Drag & Swipe Handlers */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`relative touch-none select-none cursor-grab active:cursor-grabbing ${
            !isDragging && swipeDirection === "left"
              ? "animate-swipe-left"
              : !isDragging && swipeDirection === "right"
              ? "animate-swipe-right"
              : ""
          }`}
          style={{
            transform: isDragging
              ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg) scale(${scale})`
              : swipeDirection
              ? undefined
              : "translate3d(0, 0, 0) rotate(0deg) scale(1)",
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            willChange: "transform",
          }}
        >
          <UserCard data={currentProfile} />

          {/* Dynamic LIKE / CONNECT Stamp on Card */}
          <div
            className="pointer-events-none absolute top-8 left-8 z-30 rotate-[-15deg] rounded-2xl border-4 border-rose-500 bg-rose-950/85 px-5 py-2 backdrop-blur-md shadow-2xl shadow-rose-950/80"
            style={{
              opacity: isDragging ? likeOpacity : swipeDirection === "right" ? 1 : 0,
              transform: `scale(${0.8 + likeOpacity * 0.3}) rotate(-15deg)`,
              transition: isDragging ? "none" : "opacity 0.2s ease",
            }}
          >
            <span className="flex items-center gap-2 text-2xl font-black uppercase tracking-wider text-pink-300 drop-shadow-md">
              <Heart className="h-6 w-6 fill-pink-400 text-pink-400" />
              CONNECT
            </span>
          </div>

          {/* Dynamic NOPE / PASS Stamp on Card */}
          <div
            className="pointer-events-none absolute top-8 right-8 z-30 rotate-[15deg] rounded-2xl border-4 border-blue-500 bg-blue-950/85 px-5 py-2 backdrop-blur-md shadow-2xl shadow-blue-950/80"
            style={{
              opacity: isDragging ? nopeOpacity : swipeDirection === "left" ? 1 : 0,
              transform: `scale(${0.8 + nopeOpacity * 0.3}) rotate(15deg)`,
              transition: isDragging ? "none" : "opacity 0.2s ease",
            }}
          >
            <span className="flex items-center gap-2 text-2xl font-black uppercase tracking-wider text-blue-300 drop-shadow-md">
              <X className="h-6 w-6 text-blue-400 stroke-[3]" />
              PASS
            </span>
          </div>
        </div>

        {/* Floating Action Controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          
          {/* Pass / Skip Button (Blue Accent) */}
          <button
            onClick={() => handleRequestAction("ignored", currentProfile._id)}
            disabled={loadingAction}
            aria-label="Pass"
            className="group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-300/60 dark:border-blue-400/40 bg-rose-50/80 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/15 dark:shadow-blue-500/20 backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:border-blue-500 hover:bg-blue-600 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <X className="h-8 w-8 transition-transform group-hover:rotate-90 duration-200" />
            <span className="sr-only">Pass</span>
          </button>

          {/* Super Connect / Star Button (Red/Rose Accent) */}
          <button
            onClick={() => handleRequestAction("interested", currentProfile._id)}
            disabled={loadingAction}
            aria-label="Super Like"
            className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-300/60 dark:border-rose-400/40 bg-rose-50/80 dark:bg-slate-900/90 text-rose-500 dark:text-rose-400 shadow-lg shadow-rose-500/15 dark:shadow-rose-500/20 backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:border-rose-400 hover:bg-rose-500 hover:text-white active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12 duration-200" />
            <span className="sr-only">Super Connect</span>
          </button>

          {/* Connect / Like Button (Pink + Red + Blue Gradient) */}
          <button
            onClick={() => handleRequestAction("interested", currentProfile._id)}
            disabled={loadingAction}
            aria-label="Connect"
            className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-pink-400/30 bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/30 backdrop-blur-xl transition-all duration-200 hover:scale-110 hover:shadow-rose-500/50 hover:from-blue-500 hover:via-rose-600 hover:to-pink-600 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Heart className="h-8 w-8 fill-white transition-transform group-hover:scale-125 duration-200" />
            <span className="sr-only">Connect</span>
          </button>

        </div>

        {/* Interaction hints */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="text-blue-500 dark:text-blue-400 font-bold">👈 Swipe Left</span> to Pass
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-pink-500 dark:text-pink-400 font-bold">Swipe Right 👉</span> to Connect
          </span>
        </div>

      </div>
    </div>
  );
};

export default Feed;



