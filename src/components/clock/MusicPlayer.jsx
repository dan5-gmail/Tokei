// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from "lucide-react";

import YouAndMe from "./You_and_Me.mp3";
import Twilight from "./さみしいおばけと東京の月.mp3";
import FourSide from "./FourSide.mp3";
import Frostaks_Cold_Land from "./ヒャッコル寒冷地.mp3";
import Silver_Snow_Story from "./Silver-Snow-Story.mp3";
import Fallen_Star_Beach from "./Fallen-Star-Beach.mp3";

const TRACKS = [
  {
    title: "????????",
    url: YouAndMe,
  },
  {
    title: "Twilight",
    url: Twilight,
  },

  {
    title: "Four Side",
    url: FourSide,
  },
  {
    title: "Frostaks - Cold Land",
    url: Frostaks_Cold_Land,
  },
  {
    title: "Silver-Snow-Story",
    url: Silver_Snow_Story,
  },
  {
    title: "Fallen-Star-Beach",
    url: Fallen_Star_Beach,
  }
];

export default function MusicPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // keep the element's volume in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : vol;
  }, [vol, muted]);

  // (re)load + play when the track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [idx]);

  // play / pause when toggled
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  const next = () => setIdx((i) => (i + 1) % TRACKS.length);
  const prev = () => setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  const toggle = () => setPlaying((p) => !p);

  return (
    <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 rounded-full border border-slate-200/10 bg-slate-900/40 backdrop-blur-xl px-3 sm:px-5 py-2 sm:py-3 shadow-2xl">
      <audio ref={audioRef} src={TRACKS[idx].url} onEnded={next} />
      <span className="hidden sm:block font-display text-xs tracking-[0.35em] text-slate-200/80 whitespace-nowrap max-w-[140px] truncate">
        {TRACKS[idx].title}
      </span>
      <div className="hidden sm:flex items-center gap-2 pl-1 sm:pl-2">
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted || vol === 0 ? "ミュート解除" : "ミュート"}
          className="w-8 h-8 rounded-full bg-slate-200/5 text-slate-300/70 hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          {muted || vol === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : vol}
          onChange={(e) => {
            setVol(parseFloat(e.target.value));
            setMuted(false);
          }}
          aria-label="音量"
          className="w-16 lg:w-20 h-1 accent-violet-300 cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          onClick={prev}
          aria-label="前の曲"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/5 text-slate-300/70 hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          <SkipBack size={15} />
        </button>
        <button
          onClick={toggle}
          aria-label={playing ? "停止" : "再生"}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-violet-500/20 border border-violet-300/40 text-slate-100 flex items-center justify-center transition-all hover:bg-violet-500/30"
          style={{ boxShadow: "0 0 20px rgba(139,92,246,0.25)" }}
        >
          {playing ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
        </button>
        <button
          onClick={next}
          aria-label="次の曲"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/5 text-slate-300/70 hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          <SkipForward size={15} />
        </button>
      </div>
    </div>
  );
}