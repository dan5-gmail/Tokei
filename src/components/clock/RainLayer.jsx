import React, { useMemo } from "react";

export default function RainLayer() {
    const drops = useMemo(
        () =>
            Array.from({ length: 70 }, () => ({
                left: Math.random() * 110 - 5,
                delay: -(Math.random() * 2.2),
                dur: 0.9 + Math.random() * 1.1,
                h: 12 + Math.random() * 16,
            })),
        []
    );
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ transform: "rotate(6deg) scale(1.15)" }}
            aria-hidden="true"
        >
            {drops.map((d, i) => (
                <span
                    key={i}
                    className="absolute top-0 rounded-full"
                    style={{
                        left: `${d.left}%`,
                        width: 1.5,
                        height: d.h,
                        background:
                            "linear-gradient(to bottom, transparent, rgba(203,213,225,0.55))",
                        animation: `rain-fall ${d.dur}s linear ${d.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}