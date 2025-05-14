"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBackgroundProps {
  children: React.ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
  interactive?: boolean
}

export function AnimatedGradientBackground({
  children,
  className,
  intensity = "medium",
  interactive = true,
}: AnimatedGradientBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const orbs = useRef<HTMLDivElement[]>([])

  // Define gradient intensity
  const gradientIntensity = {
    low: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    medium:
      "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
    high: "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
  }

  useEffect(() => {
    if (!interactive || !backgroundRef.current) return

    // Create orbs for background effect
    const createOrbs = () => {
      const container = backgroundRef.current
      if (!container) return

      // Clear existing orbs
      orbs.current.forEach((orb) => orb.remove())
      orbs.current = []

      // Create new orbs
      const numOrbs = 3
      for (let i = 0; i < numOrbs; i++) {
        const orb = document.createElement("div")
        const size = Math.random() * 300 + 100
        const x = Math.random() * 100
        const y = Math.random() * 100

        orb.className = `absolute rounded-full opacity-20 blur-3xl transition-all duration-5000 ease-in-out`
        orb.style.width = `${size}px`
        orb.style.height = `${size}px`
        orb.style.left = `${x}%`
        orb.style.top = `${y}%`
        orb.style.transform = `translate(-50%, -50%)`

        // Assign different colors to each orb
        if (i === 0) {
          orb.style.background = "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)"
        } else if (i === 1) {
          orb.style.background = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
        } else {
          orb.style.background = "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)"
        }

        container.appendChild(orb)
        orbs.current.push(orb)

        // Animate orbs
        animateOrb(orb)
      }
    }

    const animateOrb = (orb: HTMLDivElement) => {
      const animatePosition = () => {
        const x = Math.random() * 100
        const y = Math.random() * 100
        const duration = Math.random() * 15000 + 15000

        orb.style.transition = `all ${duration}ms ease-in-out`
        orb.style.left = `${x}%`
        orb.style.top = `${y}%`

        setTimeout(animatePosition, duration)
      }

      animatePosition()
    }

    // Handle mouse movement for interactive background
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return

      const { clientX, clientY } = e
      const { width, height } = backgroundRef.current.getBoundingClientRect()

      const x = clientX / width
      const y = clientY / height

      // Move orbs slightly based on mouse position
      orbs.current.forEach((orb, index) => {
        const factor = (index + 1) * 2
        const targetX = orb.style.left.replace("%", "")
        const targetY = orb.style.top.replace("%", "")

        orb.style.transform = `translate(-50%, -50%) translate(${(x - 0.5) * factor * 10}px, ${(y - 0.5) * factor * 10}px)`
      })
    }

    createOrbs()
    window.addEventListener("resize", createOrbs)

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("resize", createOrbs)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [interactive])

  return (
    <div
      ref={backgroundRef}
      className={cn("min-h-screen w-full overflow-hidden relative", gradientIntensity[intensity], className)}
    >
      {children}
    </div>
  )
}
