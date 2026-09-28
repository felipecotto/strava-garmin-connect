"use client"

import { useEffect, useState } from "react"

const MARATHON_KM = "42,195"

/**
 * Linha de 2px que avança com a rolagem e o contador "KM x / 42,195".
 * O KM vem do atributo `data-km` do capítulo que está na tela.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [km, setKm] = useState("0")

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-km]"))
    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0)
      const probe = window.innerHeight * 0.35
      let current = sections[0]?.dataset.km ?? "0"
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section.dataset.km ?? current
      }
      setKm(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const label = km.includes(",") ? km : `${km},0`

  return (
    <>
      <div className="absolute inset-x-0 top-0 h-0.5 bg-border" aria-hidden>
        <div className="h-full origin-left bg-signal" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <p className="type-label hidden text-signal tabular-nums lg:block" aria-live="off">
        KM {label} / {MARATHON_KM}
      </p>
    </>
  )
}
