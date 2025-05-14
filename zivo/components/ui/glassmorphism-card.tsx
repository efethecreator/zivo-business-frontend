import type React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphismCardProps {
  children: React.ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
  hoverEffect?: boolean
}

export function GlassmorphismCard({
  children,
  className,
  intensity = "medium",
  hoverEffect = false,
}: GlassmorphismCardProps) {
  // Define backdrop blur intensity
  const blurIntensity = {
    low: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    high: "backdrop-blur-lg",
  }

  // Define background opacity based on intensity
  const bgOpacity = {
    low: "bg-white/30 dark:bg-gray-900/30",
    medium: "bg-white/40 dark:bg-gray-900/40",
    high: "bg-white/50 dark:bg-gray-900/50",
  }

  // Define border opacity based on intensity
  const borderStyle = {
    low: "border border-white/20 dark:border-gray-700/20",
    medium: "border border-white/30 dark:border-gray-700/30",
    high: "border border-white/40 dark:border-gray-700/40",
  }

  // Define hover effect if enabled
  const hoverStyles = hoverEffect
    ? "transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:scale-[1.01]"
    : ""

  return (
    <div
      className={cn(
        "rounded-xl shadow-soft",
        blurIntensity[intensity],
        bgOpacity[intensity],
        borderStyle[intensity],
        hoverStyles,
        className,
      )}
    >
      {children}
    </div>
  )
}
