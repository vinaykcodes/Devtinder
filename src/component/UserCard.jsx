import React from "react";
import { Sparkles, Code, Terminal } from "lucide-react";

// Skill badge color using Pink, Red, Blue, Cyan, Amber, Emerald
const getSkillBadgeColor = (skill) => {
  const s = skill.toLowerCase();
  if (s.includes("react") || s.includes("next")) 
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
  if (s.includes("node") || s.includes("express") || s.includes("mongo")) 
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  if (s.includes("type") || s.includes("ts") || s.includes("docker")) 
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
  if (s.includes("python") || s.includes("ai") || s.includes("ml")) 
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
  if (s.includes("css") || s.includes("tailwind") || s.includes("ui")) 
    return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30";
  return "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30";
};

const UserCard = ({ data }) => {
  if (!data) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">Loading developer profile...</p>
        </div>
      </div>
    );
  }

  // Parse skills or about items
  const skills = Array.isArray(data.skills) 
    ? data.skills 
    : typeof data.skills === "string" 
      ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(data.about)
        ? data.about
        : typeof data.about === "string" && data.about.includes(",")
          ? data.about.split(",").map((s) => s.trim()).slice(0, 5)
          : ["React", "Node.js", "TypeScript", "Tailwind"];

  const avatarUrl =
    data.photourl ||
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-rose-200/60 dark:border-white/10 bg-rose-50/90 dark:bg-slate-900/85 shadow-2xl shadow-black/10 dark:shadow-rose-950/20 backdrop-blur-xl transition-all duration-300 hover:border-pink-400/50 hover:shadow-black/15">
      
      {/* Profile Image & Overlays */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950">
        <img
          src={avatarUrl}
          alt={`${data.firstName} ${data.lastName || ""}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80`;
          }}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open to Collaborate
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-950/80 px-3 py-1 text-xs font-mono text-blue-300 backdrop-blur-md">
            <Terminal className="h-3 w-3 text-blue-400" />
            Dev
          </span>
        </div>

        {/* Floating Name & Age on Image Base */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight sm:text-3xl drop-shadow-md">
              {data.firstName || "Anonymous"} {data.lastName || ""}
            </h3>
            {data.age && (
              <span className="text-lg font-mono font-semibold text-pink-300">
                {data.age}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="p-5 space-y-4">
        
        {/* Skills Tag Pills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Code className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            <span>Tech Stack</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, index) => (
              <span
                key={index}
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-mono font-medium transition-transform hover:scale-105 ${getSkillBadgeColor(
                  skill
                )}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* About / Bio */}
        {data.about && (
          <div className="rounded-2xl border border-rose-100 dark:border-white/5 bg-rose-50/50 dark:bg-white/[0.02] p-3.5">
            <p className="text-xs font-mono text-rose-500 dark:text-pink-400 mb-1">{"// about me"}</p>
            <p className="text-sm leading-relaxed text-black dark:text-slate-300">
              {Array.isArray(data.about) ? data.about.join(", ") : data.about}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserCard;


