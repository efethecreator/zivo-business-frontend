import { cn } from "@/lib/utils"
import type React from "react"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function TypographyH1({ children, className }: TypographyProps) {
  return <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl", className)}>{children}</h1>
}

export function TypographyH2({ children, className }: TypographyProps) {
  return <h2 className={cn("scroll-m-20 text-3xl font-bold tracking-tight", className)}>{children}</h2>
}

export function TypographyH3({ children, className }: TypographyProps) {
  return <h3 className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)}>{children}</h3>
}

export function TypographyH4({ children, className }: TypographyProps) {
  return <h4 className={cn("scroll-m-20 text-xl font-bold tracking-tight", className)}>{children}</h4>
}

export function TypographyP({ children, className }: TypographyProps) {
  return <p className={cn("leading-7", className)}>{children}</p>
}

export function TypographyLead({ children, className }: TypographyProps) {
  return <p className={cn("text-xl text-muted-foreground font-light", className)}>{children}</p>
}

export function TypographyLarge({ children, className }: TypographyProps) {
  return <div className={cn("text-lg font-regular", className)}>{children}</div>
}

export function TypographySmall({ children, className }: TypographyProps) {
  return <small className={cn("text-sm font-light leading-none", className)}>{children}</small>
}

export function TypographyMuted({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-muted-foreground font-light", className)}>{children}</p>
}
