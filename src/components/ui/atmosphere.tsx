import { cn } from "@/lib/utils"

/** Fixed film-grain overlay — sits above content, ignores pointer events. */
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden />
}

type AtmosphereProps = {
  className?: string
  /** denser blobs for hero / CTA moments */
  intensity?: "soft" | "strong"
}

/**
 * Soft mesh-style color blobs (warm CTT palette).
 * Place inside a `relative overflow-hidden` parent.
 */
export function Atmosphere({ className, intensity = "soft" }: AtmosphereProps) {
  const strong = intensity === "strong"

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "mesh-orb -left-[10%] -top-[20%] h-[420px] w-[420px]",
          strong ? "opacity-70" : "opacity-45"
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className={cn(
          "mesh-orb -right-[8%] top-[5%] h-[380px] w-[480px]",
          strong ? "opacity-65" : "opacity-40"
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--haze) 70%, transparent) 0%, transparent 68%)",
        }}
      />
      <div
        className={cn(
          "mesh-orb bottom-[-10%] left-[30%] h-[320px] w-[420px]",
          strong ? "opacity-55" : "opacity-35"
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--mist) 65%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className={cn(
          "mesh-orb right-[18%] top-[40%] h-[220px] w-[220px]",
          strong ? "opacity-50" : "opacity-30"
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--sand) 80%, transparent) 0%, transparent 72%)",
        }}
      />
    </div>
  )
}
