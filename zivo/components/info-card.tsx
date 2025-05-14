import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InfoCardProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function InfoCard({ title, icon, children, className, contentClassName }: InfoCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
    </Card>
  )
}
