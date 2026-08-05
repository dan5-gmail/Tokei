import React from "react";
import { MOODS } from "@/components/clock/AtmosphereLayer";
/** @type {("mist" | "rain" | "dawn" | "void")[]} */
const ORDER = ["mist", "rain", "dawn", "void"];
/**
 * @param {{
 *   mood: string,
 *   setMood: (mood:string)=>void,
 *   soundOn: boolean,
 *   setSoundOn: (value:boolean)=>void
 * }} props
 */
export default function AtmosphereBar({ mood, setMood, soundOn, setSoundOn }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-5 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {ORDER.map((k) => {
          const active = mood === k;
          return (
            <button
              key={k}
              onClick={() => setMood(k)}
              aria-label={`雰囲気: ${MOODS[k].label}`}
              className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${active
                ? "border-violet-300/50 bg-violet-500/20 text-slate-100"
                : "border-slate-600/20 bg-slate-800/30 text-slate-400/60 hover:text-slate-200"
                }`}
            >
              <span className="font-display text-sm tracking-widest">
                {MOODS[k].label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setSoundOn(!soundOn)}
        aria-label={soundOn ? "音を消す" : "音をつける"}
        className={`pointer-events-auto min-w-[48px] min-h-[48px] w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${soundOn
          ? "border-teal-300/50 bg-teal-400/15 text-teal-200"
          : "border-slate-600/20 bg-slate-800/30 text-slate-400/60"
          }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${soundOn ? "bg-teal-300 animate-pulse" : "bg-slate-500"
            }`}
        />
      </button>
    </div>
  );
}