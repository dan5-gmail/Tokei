// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";

import YouAndMe from "./You_and_Me.mp3";
import Twilight from "./さみしいおばけと東京の月.mp3";

const TRACKS = [
  {
    title: "You and Me",
    url: YouAndMe,
  },
  {
    title: "Twilight",
    url: Twilight,
  },
];

export default function MusicPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);

  // 曲が変わったとき
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.load();

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [idx]);

  // 再生 / 一時停止
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  // 次の曲
  const next = () => {
    setIdx((i) => (i + 1) % TRACKS.length);
  };

  // 前の曲
  const prev = () => {
    setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  };

  // 再生 / 一時停止
  const toggle = () => {
    setPlaying((p) => !p);
  };

  // 曲が終わったら次へ
  const handleEnded = () => {
    setIdx((i) => (i + 1) % TRACKS.length);
  };

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={TRACKS[idx].url}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* 曲名 */}
      <div className="text-sm text-slate-100 min-w-[120px] text-center">
        {TRACKS[idx].title}
      </div>

      {/* 前の曲 */}
      <button
        onClick={prev}
        aria-label="前の曲"
        className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-300/40 text-slate-100 flex items-center justify-center transition-all hover:bg-violet-500/30"
      >
        <SkipBack size={18} />
      </button>

      {/* 再生 / 一時停止 */}
      <button
        onClick={toggle}
        aria-label={playing ? "一時停止" : "再生"}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-violet-500/20 border border-violet-300/40 text-slate-100 flex items-center justify-center transition-all hover:bg-violet-500/30"
        style={{
          boxShadow: "0 0 20px rgba(139,92,246,0.25)",
        }}
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* 次の曲 */}
      <button
        onClick={next}
        aria-label="次の曲"
        className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-300/40 text-slate-100 flex items-center justify-center transition-all hover:bg-violet-500/30"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
}