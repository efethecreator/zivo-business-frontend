import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  action?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  action,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b", className)}>
      <div>
        <h1 className={cn("text-3xl font-bold tracking-tight", titleClassName)}>{title}</h1>
        {description && <p className={cn("text-muted-foreground mt-1.5", descriptionClassName)}>{description}</p>}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  )
}
