import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = {
  work: { label: "集中", duration: 25 * 60, color: "#8B5CF6" },
  short: { label: "小休止", duration: 5 * 60, color: "#5EEAD4" },
  long: { label: "深い休止", duration: 15 * 60, color: "#5EEAD4" },
};

const RADIUS = 150;
const STROKE = 6;
const SIZE = (RADIUS + STROKE) * 2;
const circumference = 2 * Math.PI * RADIUS;

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroRing() {
  const [phase, setPhase] = useState("work");
  const [remaining, setRemaining] = useState(PHASES.work.duration);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1); // 1..4
  const [ended, setEnded] = useState(false);

  const cfg = PHASES[phase];

  // tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          setEnded(true);
          playChime();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // advance phase after end
  useEffect(() => {
    if (!ended) return;
    const id = setTimeout(() => {
      advancePhase();
      setEnded(false);
    }, 3500);
    return () => clearTimeout(id);
  }, [ended]);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      let next;
      if (prev === "work") {
        const isLong = cycle >= 4;
        next = isLong ? "long" : "short";
        if (isLong) setCycle(1);
        else setCycle((c) => c + 1);
      } else {
        next = "work";
      }
      setRemaining(PHASES[next].duration);
      return next;
    });
  }, [cycle]);

  const start = () => {
    if (remaining <= 0) setRemaining(cfg.duration);
    setEnded(false);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setEnded(false);
    setRemaining(cfg.duration);
  };
  const skip = () => {
    setRunning(false);
    setEnded(false);
    advancePhase();
  };

  const progress = cfg.duration > 0 ? remaining / cfg.duration : 0;
  const dashOffset = circumference - progress * circumference;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none transition-all duration-[3000ms] ${ended ? "brightness-200" : ""
        }`}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          tabIndex={0}
          role="timer"
          aria-label={`ポモドーロ ${cfg.label} ${fmt(remaining)}`}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              running ? pause() : start();
            }
          }}
        >
          <defs>
            <linearGradient id="pomoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={cfg.color} />
              <stop offset="100%" stopColor="#5EEAD4" />
            </linearGradient>
            <filter id="pomoGlow">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(226,232,240,0.08)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#pomoGrad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: running ? 1 : 0.6, ease: "linear" }}
            filter="url(#pomoGlow)"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={`${cfg.color}22`}
            strokeWidth={STROKE * 3}
            animate={running ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.03, 1] } : {}}
            transition={running ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}
            style={{ transformOrigin: "center" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[0.65rem] tracking-[0.5em] uppercase text-slate-400/70 mb-2">
            {cfg.label}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={ended ? "ended" : fmt(remaining)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6 }}
              className="font-display font-extralight text-6xl sm:text-7xl text-slate-100 tabular-nums"
            >
              {ended ? "終" : fmt(remaining)}
            </motion.span>
          </AnimatePresence>
          <span className="mt-3 text-xs tracking-[0.4em] text-slate-400/50 uppercase">
            {ended ? "次の刻へ" : `サイクル ${cycle} / 4`}
          </span>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        {!running ? (
          <button
            onClick={start}
            className="min-w-[48px] min-h-[48px] px-8 h-12 rounded-full border border-violet-400/30 bg-violet-500/10 text-slate-100 text-sm tracking-[0.3em] uppercase hover:bg-violet-500/20 transition-colors"
          >
            {remaining !== cfg.duration && remaining > 0 ? "続ける" : "始める"}
          </button>
        ) : (
          <button
            onClick={pause}
            className="min-w-[48px] min-h-[48px] px-8 h-12 rounded-full border border-teal-300/30 bg-teal-400/10 text-slate-100 text-sm tracking-[0.3em] uppercase hover:bg-teal-400/20 transition-colors"
          >
            停む
          </button>
        )}
        <button
          onClick={skip}
          className="min-w-[48px] min-h-[48px] px-6 h-12 rounded-full text-slate-400 text-sm tracking-[0.3em] uppercase hover:text-slate-200 transition-colors"
        >
          次へ
        </button>
        <button
          onClick={reset}
          className="min-w-[48px] min-h-[48px] px-6 h-12 rounded-full text-slate-400 text-sm tracking-[0.3em] uppercase hover:text-slate-200 transition-colors"
        >
          戻す
        </button>
      </div>

      {/* cycle dots */}
      <div className="mt-6 flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${n < cycle
                ? "bg-violet-400"
                : n === cycle
                  ? "bg-violet-300/70 scale-125"
                  : "bg-slate-600/40"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [528, 660, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const start = now + i * 0.4;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.4);
      gain.gain.linearRampToValueAtTime(0, start + 4);
      osc.start(start);
      osc.stop(start + 4.2);
    });
  } catch (e) { }
}