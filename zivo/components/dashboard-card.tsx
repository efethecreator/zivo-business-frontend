import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  description?: string
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  footer,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
      {footer && <CardFooter className={cn("border-t bg-muted/20 p-4", footerClassName)}>{footer}</CardFooter>}
    </Card>
  )
}
