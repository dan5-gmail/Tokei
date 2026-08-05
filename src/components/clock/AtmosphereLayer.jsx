import React from "react";
import Bubbles from "@/components/clock/Bubbles";


const BG_URL = "/background.png";


const MOODS = {

  mist: {
    label: "霧",
    tint: "rgba(139,92,246,0.10)",
    halo: "rgba(139,92,246,0.22)",
    speed: 38,
  },

  rain: {
    label: "雨",
    tint: "rgba(94,234,212,0.08)",
    halo: "rgba(94,234,212,0.18)",
    speed: 26,
  },

  dawn: {
    label: "暁",
    tint: "rgba(251,191,114,0.10)",
    halo: "rgba(251,191,114,0.20)",
    speed: 44,
  },

  void: {
    label: "静",
    tint: "rgba(15,17,26,0)",
    halo: "rgba(226,232,240,0.10)",
    speed: 60,
  },

};

/**
 * @param {{
 *   mood: "mist" | "rain" | "dawn" | "void",
 *   hour: number
 * }} props
 */
export default function AtmosphereLayer({
  mood,
  hour,
}) {


  const moodCfg = MOODS[mood] || MOODS.mist;


  let ambient;


  if (hour >= 5 && hour < 8) {

    ambient = "rgba(251,191,114,0.12)";

  } else if (hour >= 8 && hour < 17) {

    ambient = "rgba(94,234,212,0.05)";

  } else if (hour >= 17 && hour < 20) {

    ambient = "rgba(244,114,182,0.10)";

  } else {

    ambient = "rgba(99,102,241,0.14)";

  }



  return (

    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#0F111A",
        }}
      />


      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
          filter: "saturate(0.9) blur(2px)",
        }}
      />


      <div
        className="absolute inset-0"
        style={{
          background:
            `
          radial-gradient(
            60% 50% at 50% 45%,
            ${moodCfg.halo}
            0%,
            transparent 70%
          ),

          radial-gradient(
            40% 40% at 30% 70%,
            ${ambient}
            0%,
            transparent 70%
          )
          `,
          animation:
            `mist-drift ${moodCfg.speed}s ease-in-out infinite`,
        }}
      />


      <Bubbles />


      <div
        className="absolute inset-0 transition-opacity duration-[3000ms]"
        style={{
          background:
            `linear-gradient(
            180deg,
            transparent 0%,
            ${moodCfg.tint} 100%
          )`,
        }}
      />


      <div
        className="absolute inset-0"
        style={{
          background:
            `
          radial-gradient(
            120% 120% at 50% 50%,
            transparent 40%,
            rgba(15,17,26,0.85) 100%
          )
          `,
        }}
      />


    </div>

  );
}

export { MOODS };