import type React from "react"
import { cn } from "@/lib/utils"

interface ShimmerEffectProps {
  children: React.ReactNode
  className?: string
  width?: string
  delay?: string
}

export function ShimmerEffect({ children, className, width = "w-full", delay = "0s" }: ShimmerEffectProps) {
  return (
    <div className={cn("relative overflow-hidden", width, className)}>
      {children}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animationDelay: delay }}
      />
    </div>
  )
}
