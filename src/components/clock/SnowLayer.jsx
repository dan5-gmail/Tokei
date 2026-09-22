//@ts-nocheck
import React, { useMemo } from "react";

export default function SnowLayer() {
    const flakes = useMemo(
        () =>
            Array.from({ length: 90 }, () => ({
                left: Math.random() * 100,
                delay: -(Math.random() * 16),
                dur: 8 + Math.random() * 10,
                size: 2 + Math.random() * 3.5,
                sway: (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 60),
                blur: Math.random() < 0.3,
            })),
        []
    );
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {flakes.map((f, i) => (
                <span
                    key={i}
                    className="absolute top-0 rounded-full bg-slate-100"
                    style={{
                        left: `${f.left}%`,
                        width: f.size,
                        height: f.size,
                        filter: f.blur ? "blur(1.5px)" : undefined,
                        boxShadow: "0 0 5px rgba(226,232,240,0.4)",
                        animation: `snow-fall ${f.dur}s linear ${f.delay}s infinite`,
                        ["--sway"]: `${f.sway}px`,
                    }}
                />
            ))}
        </div>
    );
}