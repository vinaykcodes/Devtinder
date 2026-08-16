import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Sparkles, 
  Image, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Save, 
  Compass
} from "lucide-react";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
];

const SUGGESTED_SKILLS = [
  "React", "Node.js", "TypeScript", "Python", "Next.js", 
  "TailwindCSS", "GraphQL", "MongoDB", "PostgreSQL", "Docker", "AWS"
];

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [photourl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");
  const [notification, setNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || "");
      setPhotoUrl(user.photourl || "");
      setAbout(Array.isArray(user.about) ? user.about.join(", ") : user.about || "");
    }
  }, [user]);

  const formHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = {
      firstName,
      lastName,
      age,
      photourl,
      about,
    };

    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", data, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
      }, 4000);
    } catch (error) {
      console.error(
        "Edit profile failed:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (skill) => {
    const currentList = about ? about.split(",").map(s => s.trim()) : [];
    if (!currentList.includes(skill)) {
      const updated = currentList.length > 0 ? `${about}, ${skill}` : skill;
      setAbout(updated);
    }
  };

  return (
    <div className="relative py-4 sm:py-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 p-4 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            <div>
              <p className="text-sm font-bold text-black dark:text-white">Profile Updated</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Your profile changes are live on the feed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight sm:text-3xl">
            Developer Profile Studio
          </h1>
          <p className="mt-1 text-sm text-slate-800 dark:text-slate-400">
            Customize how you appear to fellow developers matching on DevTinder.
          </p>
        </div>

        <button
          onClick={() => navigate("/feed")}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/80 px-4 py-2 text-sm font-medium text-black dark:text-slate-300 shadow-md shadow-black/[0.05] transition hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-white cursor-pointer"
        >
          <Compass className="h-4 w-4 text-rose-500" />
          Back to Feed
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Form: Column 7 */}
        <div className="lg:col-span-7">
          <form
            onSubmit={formHandler}
            className="rounded-3xl border border-rose-200/60 dark:border-white/10 bg-white dark:bg-slate-900/85 p-6 sm:p-8 shadow-2xl shadow-black/[0.08] dark:shadow-rose-950/20 backdrop-blur-xl space-y-6 transition-colors duration-300"
          >
            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                <User className="h-4 w-4" />
                <span>Basic Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black dark:text-slate-300 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black dark:text-slate-300 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-black dark:text-slate-300 mb-1.5">
                  Age / Experience Level
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="25 or 3+ Yrs Exp"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 py-2.5 pl-10 pr-3.5 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Avatar Photo */}
            <div className="pt-4 border-t border-rose-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3">
                <Image className="h-4 w-4" />
                <span>Profile Photo URL</span>
              </div>

              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photourl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono text-xs"
                />
              </div>

              {/* Preset Avatar Selection */}
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Or choose a preset developer avatar:</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`relative h-11 w-11 shrink-0 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        photourl === url
                          ? "border-rose-500 ring-2 ring-rose-500/50 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Skills & Bio */}
            <div className="pt-4 border-t border-rose-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-3">
                <FileText className="h-4 w-4" />
                <span>Bio & Tech Stack</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-black dark:text-slate-300 mb-1.5">
                  About / Bio (Comma separated skills will render as badges)
                </label>
                <textarea
                  rows={3}
                  placeholder="Full stack engineer passionate about AI, distributed systems, React, and building products..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full rounded-xl border border-rose-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Quick skill chips to add */}
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Click to append popular tech tags:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200/50 dark:border-white/10 bg-rose-50/50 dark:bg-slate-950/60 px-2 py-1 text-xs font-mono text-black dark:text-slate-300 transition hover:border-rose-500 hover:text-rose-500 dark:hover:text-white cursor-pointer"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button (Pink + Red + Blue Gradient) */}
            <button
              type="submit"
              disabled={isSaving}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-rose-500 to-pink-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-500/40 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Live Preview: Column 5 */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Live Feed Card Preview
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Real-time
            </span>
          </div>

          <UserCard
            data={{
              firstName: firstName || "Your Name",
              lastName: lastName || "",
              age: age || "24",
              photourl: photourl,
              about: about || "Full stack developer ready to build groundbreaking applications.",
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default EditProfile;


