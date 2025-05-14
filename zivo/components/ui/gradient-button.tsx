import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface GradientButtonProps extends ButtonProps {
  gradientFrom?: string
  gradientTo?: string
  hoverScale?: boolean
  shimmer?: boolean
}

export function GradientButton({
  children,
  className,
  gradientFrom = "from-primary",
  gradientTo = "to-primary-light",
  hoverScale = true,
  shimmer = false,
  ...props
}: GradientButtonProps) {
  const hoverScaleClass = hoverScale ? "hover:scale-[1.02] active:scale-[0.98]" : ""

  const shimmerClass = shimmer
    ? "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
    : ""

  return (
    <Button
      className={cn(
        "bg-gradient-to-r shadow-soft transition-all duration-300",
        gradientFrom,
        gradientTo,
        hoverScaleClass,
        shimmerClass,
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
