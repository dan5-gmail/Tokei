import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RADIUS = 150;
const STROKE = 6;
const SIZE = (RADIUS + STROKE) * 2;

function descriptorFor(seconds) {
  if (seconds <= 0) return "時を整える";
  if (seconds < 60) return "ひと息のあいだ";
  if (seconds < 180) return "ひとときの集中";
  if (seconds < 600) return "深まる静寂";
  if (seconds < 1800) return "半刻の沈潜";
  return "長い旅路";
}

function fmt(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerRing() {
  const [total, setTotal] = useState(300); // seconds being set
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const svgRef = useRef(null);
  const draggingRef = useRef(false);

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

  // zen transition clear after a while
  useEffect(() => {
    if (!ended) return;
    const id = setTimeout(() => setEnded(false), 6000);
    return () => clearTimeout(id);
  }, [ended]);

  const angleFromEvent = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    // 0 deg at top, clockwise
    let ang = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (ang < 0) ang += 360;
    return ang;
  }, []);

  const secondsFromAngle = useCallback(
    (ang) => {
      // full circle = 60 minutes = 3600s; min 10s
      let secs = Math.round((ang / 360) * 3600);
      secs = Math.max(10, Math.min(3600, secs));
      // snap to 5s
      secs = Math.round(secs / 5) * 5;
      return secs;
    },
    []
  );

  const onPointerDown = (e) => {
    if (running) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const ang = angleFromEvent(e.clientX, e.clientY);
    const secs = secondsFromAngle(ang);
    setTotal(secs);
    setRemaining(secs);
    setEnded(false);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || running) return;
    const ang = angleFromEvent(e.clientX, e.clientY);
    const secs = secondsFromAngle(ang);
    setTotal(secs);
    setRemaining(secs);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  // keyboard: arrow up/down adjust minutes when not running
  const onKeyDown = (e) => {
    if (running) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const t = Math.min(3600, total + 60);
      setTotal(t);
      setRemaining(t);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const t = Math.max(10, total - 60);
      setTotal(t);
      setRemaining(t);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      start();
    }
  };

  const start = () => {
    if (remaining <= 0) {
      setRemaining(total);
    }
    setEnded(false);
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setEnded(false);
    setRemaining(total);
  };

  const circumference = 2 * Math.PI * RADIUS;
  const progress = total > 0 ? remaining / total : 0;
  const setAngle = (total / 3600) * 360; // for setting mode ring fill
  const dashSetting = (setAngle / 360) * circumference;
  const dashRunning = circumference - progress * circumference;

  const display = running || remaining !== total ? remaining : total;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none transition-all duration-[3000ms] ${ended ? "brightness-200" : ""
        }`}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          ref={svgRef}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="touch-none"
          style={{ cursor: running ? "default" : "grab" }}
          tabIndex={0}
          role="slider"
          aria-label="タイマーの時間設定"
          aria-valuemin={0}
          aria-valuemax={60}
          aria-valuenow={Math.round(total / 60)}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onFocus={(e) => e.currentTarget.style.outline = "2px solid rgba(94,234,212,0.6)"}
          onBlur={(e) => e.currentTarget.style.outline = "none"}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#5EEAD4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(226,232,240,0.08)"
            strokeWidth={STROKE}
          />

          {running ? (
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset: [circumference - progress * circumference, circumference],
              }}
              transition={{
                duration: remaining,
                ease: "linear",
              }}
              filter="url(#glow)"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          ) : (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - dashSetting}
              filter="url(#glow)"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}

          {/* halo */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(139,92,246,0.15)"
            strokeWidth={STROKE * 3}
            animate={running ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.03, 1] } : {}}
            transition={running ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}
            style={{ transformOrigin: "center" }}
          />
        </svg>

        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={ended ? "ended" : "time"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <span className="font-display font-extralight text-6xl sm:text-7xl text-slate-100 tabular-nums">
                {ended ? "終" : fmt(display)}
              </span>
              <span className="mt-3 text-xs tracking-[0.4em] text-violet-300/50 uppercase">
                {ended ? "時は満ちた" : descriptorFor(display)}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* controls */}
      <div className="mt-10 flex items-center gap-6">
        {!running ? (
          <button
            onClick={start}
            className="min-w-[48px] min-h-[48px] px-8 h-12 rounded-full border border-violet-400/30 bg-violet-500/10 text-slate-100 text-sm tracking-[0.3em] uppercase hover:bg-violet-500/20 transition-colors"
          >
            {remaining !== total && remaining > 0 ? "続ける" : "始める"}
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
          onClick={reset}
          className="min-w-[48px] min-h-[48px] px-6 h-12 rounded-full text-slate-400 text-sm tracking-[0.3em] uppercase hover:text-slate-200 transition-colors"
        >
          戻す
        </button>
      </div>
      {!running && (
        <p className="mt-6 text-[0.7rem] tracking-[0.3em] text-slate-500/70 uppercase">
          リングをドラッグ · 矢印キーで分調整
        </p>
      )}
    </div>
  );
}

// gentle singing-bowl-like chime using WebAudio
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
  } catch (e) {
    // silent fail
  }
}