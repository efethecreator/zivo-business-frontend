import type React from "react"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface HoverCardEnhancedProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
  width?: number | string
}

export function HoverCardEnhanced({
  trigger,
  children,
  className,
  side = "top",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  width = 320,
}: HoverCardEnhancedProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          "z-50 w-auto min-w-[220px] rounded-xl border border-white/20 bg-white/40 p-4 shadow-lg backdrop-blur-md data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade",
          className,
        )}
        style={{ width }}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
