// @ts-nocheck
import React from "react";
import { MOODS } from "./AtmosphereLayer";
import MusicPlayer from "./MusicPlayer";

const ORDER = ["mist", "rain", "dawn", "void"];

/**
 * @param {object} props
 * @param {string} props.mood
 * @param {(mood: string) => void} props.setMood
 */
export default function AtmosphereBar({ mood, setMood }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-5 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {ORDER.map((k) => {
          const active = mood === k;
          // @ts-ignore
          const moodItem = MOODS[k];
          return (
            <button
              key={k}
              onClick={() => setMood(k)}
              aria-label={`雰囲気: ${moodItem ? moodItem.label : k}`}
              className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${active
                ? "border-violet-300/50 bg-violet-500/20 text-slate-100"
                : "border-slate-600/20 bg-slate-800/30 text-slate-400/60 hover:text-slate-200"
                }`}
            >
              <span className="font-display text-sm tracking-widest">
                {moodItem ? moodItem.label : k}
              </span>
            </button>
          );
        })}
      </div>

      <MusicPlayer />
    </div>
  );
}