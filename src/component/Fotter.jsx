import React from "react";
import { Flame, Code2, Heart } from "lucide-react";

const Fotter = () => {
  return (
    <footer className="w-full border-t border-rose-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl py-6 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-rose-500 to-pink-500 shadow-md shadow-rose-500/20">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-black dark:text-white">
                Dev<span className="text-gradient-tri">Tinder</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Match, Pair-Program & Build Amazing Products
              </p>
            </div>
          </div>

          {/* Center Tech Stack Badge */}
          <div className="flex items-center gap-2 rounded-full border border-rose-200/50 dark:border-white/10 bg-rose-50/50 dark:bg-white/5 px-3.5 py-1 text-xs font-mono text-black dark:text-slate-300">
            <Code2 className="h-3.5 w-3.5 text-rose-500 dark:text-pink-400" />
            <span>Built with React 19 • Tailwind CSS • Vite</span>
          </div>

          {/* Socials & Love */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 inline" /> for Developers
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 dark:hover:bg-white/10 hover:text-rose-600 dark:hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 dark:hover:bg-white/10 hover:text-rose-600 dark:hover:text-white"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Fotter;



