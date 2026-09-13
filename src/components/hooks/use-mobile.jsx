import { useEffect, useState } from "react"

export function useDevice() {
  const [device, setDevice] = useState("desktop")

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth

      if (w < 768) setDevice("mobile")
      else if (w < 1200) setDevice("tablet")
      else setDevice("desktop")
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return device
}
