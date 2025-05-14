"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 })
  const valueRef = useRef<number>(0)
  const stepRef = useRef<number>(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!isInView || !nodeRef.current) return

    const startTime = performance.now()
    const startValue = 0
    const endValue = value
    const totalSteps = Math.floor(duration * 60) // 60fps
    stepRef.current = (endValue - startValue) / totalSteps

    const updateCounter = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      valueRef.current = startValue + (endValue - startValue) * progress

      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${valueRef.current.toFixed(decimals)}${suffix}`
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateCounter)
      }
    }

    frameRef.current = requestAnimationFrame(updateCounter)

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [isInView, value, duration, prefix, suffix, decimals])

  return (
    <span ref={nodeRef} className={cn("tabular-nums", className)}>
      {`${prefix}0${suffix}`}
    </span>
  )
}
