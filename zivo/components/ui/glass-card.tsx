import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FadeIn } from "@/components/ui/animations"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  intensity?: "light" | "medium" | "heavy"
  animation?: boolean
  delay?: number
}

export function GlassCard({
  children,
  className,
  header,
  footer,
  intensity = "medium",
  animation = true,
  delay = 0,
  ...props
}: GlassCardProps) {
  const intensityMap = {
    light: "bg-white/30 backdrop-blur-sm border-white/20",
    medium: "bg-white/40 backdrop-blur-md border-white/30",
    heavy: "bg-white/50 backdrop-blur-lg border-white/40",
  }

  const cardContent = (
    <Card
      className={cn(
        "rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
        intensityMap[intensity],
        className,
      )}
      {...props}
    >
      {header && <CardHeader className="pb-2">{header}</CardHeader>}
      <CardContent className={cn(!header && "pt-6")}>{children}</CardContent>
      {footer && <CardFooter className="pt-2">{footer}</CardFooter>}
    </Card>
  )

  if (animation) {
    return <FadeIn delay={delay}>{cardContent}</FadeIn>
  }

  return cardContent
}

export function GlassCardGrid({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            delay: index * 0.1,
          })
        }
        return child
      })}
    </div>
  )
}
