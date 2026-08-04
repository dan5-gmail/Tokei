import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getJSTParts(now) {
  // now is a Date; compute JST via toLocaleString with timeZone
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const h = parts.find((p) => p.type === "hour")?.value || "00";
  const m = parts.find((p) => p.type === "minute")?.value || "00";
  const s = parts.find((p) => p.type === "second")?.value || "00";
  return { h, m, s };
}

function getJSTDate(now) {
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  return fmt.format(now);
}

function periodLabel(hour) {
  if (hour >= 5 && hour < 8) return "夜明けの静寂";
  if (hour >= 8 && hour < 12) return "朝の光";
  if (hour >= 12 && hour < 17) return "午後の陽だまり";
  if (hour >= 17 && hour < 20) return "夕暮れの色";
  if (hour >= 20 && hour < 23) return "夜のとばり";
  return "深夜の沈黙";
}

export default function JSTClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { h, m, s } = getJSTParts(now);
  const hourNum = parseInt(h, 10);
  const dateStr = getJSTDate(now);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="mb-6 sm:mb-10"
      >
        <span className="text-[0.7rem] sm:text-xs uppercase tracking-[0.6em] text-slate-400/80">
          Japan Standard Time
        </span>
      </motion.div>

      <div className="flex items-end justify-center gap-1 sm:gap-3 leading-none">
        <span className="font-display font-extralight text-[18vw] sm:text-[15vw] md:text-[14rem] text-slate-100 tabular-nums">
          {h}
        </span>
        <span className="font-display font-extralight text-[18vw] sm:text-[15vw] md:text-[14rem] text-slate-100/80">
          :
        </span>
        <span className="font-display font-extralight text-[18vw] sm:text-[15vw] md:text-[14rem] text-slate-100 tabular-nums">
          {m}
        </span>
        {/* vapor-trail seconds */}
        <motion.span
          key={s}
          initial={{ opacity: 0.12, y: 6 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display font-extralight text-[8vw] sm:text-[6vw] md:text-7xl text-teal-300/40 tabular-nums mb-2 sm:mb-4 ml-1"
        >
          {s}
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="mt-8 sm:mt-12 flex flex-col items-center gap-2"
      >
        <span className="text-sm sm:text-base tracking-[0.35em] text-slate-300/70">
          {dateStr}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={periodLabel(hourNum)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 1 }}
            className="text-xs sm:text-sm tracking-[0.5em] uppercase text-violet-300/50"
          >
            {periodLabel(hourNum)}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}