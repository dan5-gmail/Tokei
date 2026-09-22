//@ts-nocheck
import React, { useMemo } from "react";

export default function SpaceLayer() {
    const stars = useMemo(
        () =>
            Array.from({ length: 110 }, () => {
                const big = Math.random() < 0.18;
                return {
                    left: Math.random() * 100,
                    top: Math.random() * 100,
                    size: big ? 2.2 + Math.random() * 1.6 : 1 + Math.random() * 1.2,
                    delay: Math.random() * 5,
                    dur: 2.5 + Math.random() * 4,
                    big,
                };
            }),
        []
    );

    // meteors fall from the upper-right toward the lower-left at varied speeds;
    // some vanish mid-flight before reaching the screen edge
    const meteors = useMemo(() => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
        const vh = typeof window !== "undefined" ? window.innerHeight : 900;
        return Array.from({ length: 8 }, () => {
            const midFade = Math.random() < 0.45;
            const mx = -(70 + Math.random() * 50);
            const my = 38 + Math.random() * 32;
            // tilt the streak so its tail follows the fall direction
            const rot = -(
                Math.atan2((my / 100) * vh, (Math.abs(mx) / 100) * vw) *
                180 /
                Math.PI
            );
            return {
                left: 50 + Math.random() * 62,
                top: -4 + Math.random() * 34,
                delay: Math.random() * 20,
                dur: 9 + Math.random() * 13,
                len: 90 + Math.random() * 110,
                mx,
                my,
                rot,
                anim: midFade ? "meteor-streak-mid" : "meteor-streak",
            };
        });
    }, []);

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {stars.map((s, i) => (
                <span
                    key={i}
                    className="absolute rounded-full bg-slate-100"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        boxShadow: s.big
                            ? "0 0 7px rgba(226,232,240,0.75)"
                            : "0 0 3px rgba(226,232,240,0.4)",
                        animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                    }}
                />
            ))}
            {meteors.map((m, i) => (
                <span
                    key={`m${i}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${m.left}%`,
                        top: `${m.top}%`,
                        width: m.len,
                        height: 2,
                        background:
                            "linear-gradient(90deg, rgba(226,232,240,0.95), transparent)",
                        filter: "drop-shadow(0 0 3px rgba(226,232,240,0.8))",
                        opacity: 0,
                        animation: `${m.anim} ${m.dur}s linear ${m.delay}s infinite`,
                        ["--mx"]: `${m.mx}vw`,
                        ["--my"]: `${m.my}vh`,
                        ["--rot"]: `${m.rot}deg`,
                    }}
                />
            ))}
        </div>
    );
}