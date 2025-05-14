import type React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  action?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between mb-6", className)}>
      <div>
        <h2 className={cn("text-2xl font-bold tracking-tight", titleClassName)}>{title}</h2>
        {description && <p className={cn("text-muted-foreground mt-1", descriptionClassName)}>{description}</p>}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  )
}
