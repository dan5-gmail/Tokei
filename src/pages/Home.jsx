// @ts-nocheck

import React, { useState, useEffect } from "react";
import AtmosphereLayer from "@/components/clock/AtmosphereLayer";
import JSTClock from "@/components/clock/JSTClock";
import TimerRing from "@/components/clock/TimerRing";
import PomodoroRing from "@/components/clock/PomodoroRing";
import AtmosphereBar from "@/components/clock/AtmosphereBar";
import MusicPlayer from "@/components/audio/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState("clock");
  const [mood, setMood] = useState("mist");
  const [cursor, setCursor] = useState({ x: -200, y: -200 });

  const [hour, setHour] = useState(
    parseInt(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        hour12: false,
      }).format(new Date()),
      10
    )
  );

  // 時刻を1分ごとに更新
  useEffect(() => {
    const id = setInterval(() => {
      const h = parseInt(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          hour12: false,
        }).format(new Date()),
        10
      );

      setHour(h);
    }, 60000);

    return () => clearInterval(id);
  }, []);

  // マウスカーソル追従
  const onMove = (e) => {
    setCursor({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={onMove}
    >
      {/* ================================
          Background / Atmosphere
          ================================ */}
      <AtmosphereLayer
        mood={mood}
        hour={hour}
      />

      {/* ================================
          Magnetic cursor
          ================================ */}
      <div
        className="pointer-events-none fixed z-30 w-10 h-10 rounded-full blur-xl transition-transform duration-300 ease-out hidden sm:block"
        style={{
          left: cursor.x - 20,
          top: cursor.y - 20,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* ================================
          Top mode toggle
          ================================ */}
      <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full border border-slate-600/15 bg-slate-900/30 backdrop-blur-md">
        <ModeBtn
          active={view === "clock"}
          onClick={() => setView("clock")}
        >
          時計
        </ModeBtn>

        <ModeBtn
          active={view === "timer"}
          onClick={() => setView("timer")}
        >
          タイマー
        </ModeBtn>

        <ModeBtn
          active={view === "pomodoro"}
          onClick={() => setView("pomodoro")}
        >
          ポモドーロ
        </ModeBtn>
      </div>

      {/* ================================
          Main content
          ================================ */}
      <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {/* 時計 */}
          {view === "clock" ? (
            <motion.section
              key="clock"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.02,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              <JSTClock />
            </motion.section>

          ) : view === "timer" ? (
            /* タイマー */
            <motion.section
              key="timer"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.02,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="w-full flex justify-center"
            >
              <TimerRing />
            </motion.section>

          ) : (
            /* ポモドーロ */
            <motion.section
              key="pomodoro"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.02,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="w-full flex justify-center"
            >
              <PomodoroRing />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* ================================
          Atmosphere controls
          ================================ */}
      <AtmosphereBar
        mood={mood}
        setMood={setMood}
      />

      {/* ================================
          Music Player
          ================================ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <MusicPlayer />
      </div>

      {/* ================================
          Brand mark
          ================================ */}
      <div className="fixed top-6 left-6 sm:left-10 z-20 pointer-events-none">
        <span className="font-display text-xs tracking-[0.5em] text-slate-400/50 uppercase">
          Chronometer
        </span>
      </div>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[40px] px-6 rounded-full text-sm tracking-[0.3em] transition-all duration-500 ${active
          ? "bg-slate-100/10 text-slate-100"
          : "text-slate-400/60 hover:text-slate-200"
        }`}
    >
      {children}
    </button>
  );
}