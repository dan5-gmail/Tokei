import React, { useMemo } from "react";

const BUBBLES = [
  { size: 120, left: "8%", delay: 0, dur: 26, drift: 60 },
  { size: 70, left: "22%", delay: 6, dur: 32, drift: -40 },
  { size: 180, left: "40%", delay: 12, dur: 38, drift: 80 },
  { size: 90, left: "58%", delay: 3, dur: 28, drift: -50 },
  { size: 140, left: "72%", delay: 9, dur: 34, drift: 55 },
  { size: 60, left: "85%", delay: 15, dur: 30, drift: -35 },
  { size: 100, left: "15%", delay: 18, dur: 36, drift: 45 },
  { size: 130, left: "65%", delay: 5, dur: 40, drift: -60 },
];

export default function Bubbles() {
  const bubbles = useMemo(() => BUBBLES, []);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: `-${b.size}px`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.18), rgba(94,234,212,0.08) 50%, transparent 70%)",
            border: "1px solid rgba(226,232,240,0.06)",
            backdropFilter: "blur(4px)",
            animation: `bubble-rise ${b.dur}s ease-in-out ${b.delay}s infinite`,
            ["--drift"]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}