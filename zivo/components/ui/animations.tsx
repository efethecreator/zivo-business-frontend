"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const FadeIn = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScaleIn = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideIn = ({
  children,
  className,
  direction = "right",
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: React.ReactNode
  className?: string
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -20 },
    down: { x: 0, y: 20 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const Pulse = ({
  children,
  className,
  delay = 0,
  duration = 2,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  [key: string]: any
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
        opacity: [0.9, 1, 0.9],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const Shimmer = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["0%", "200%"] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

export const GlowingBorder = ({
  children,
  className,
  glowColor = "rgba(255, 255, 255, 0.2)",
  ...props
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  [key: string]: any
}) => {
  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)} {...props}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(45deg, transparent, ${glowColor}, transparent)`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
