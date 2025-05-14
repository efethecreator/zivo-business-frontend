"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState({
    score: 0,
    label: "",
    color: "",
    percentage: 0,
  })

  useEffect(() => {
    const calculateStrength = (password: string) => {
      if (!password) {
        return {
          score: 0,
          label: "",
          color: "",
          percentage: 0,
        }
      }

      let score = 0

      // Length check
      if (password.length >= 8) score += 1
      if (password.length >= 12) score += 1

      // Character type checks
      if (/[A-Z]/.test(password)) score += 1
      if (/[a-z]/.test(password)) score += 1
      if (/[0-9]/.test(password)) score += 1
      if (/[^A-Za-z0-9]/.test(password)) score += 1

      // Determine strength level based on score
      let label = ""
      let color = ""
      let percentage = 0

      if (score <= 2) {
        label = "Weak"
        color = "bg-red-400"
        percentage = 25
      } else if (score <= 4) {
        label = "Medium"
        color = "bg-yellow-400"
        percentage = 50
      } else if (score <= 5) {
        label = "Strong"
        color = "bg-blue-400"
        percentage = 75
      } else {
        label = "Very Strong"
        color = "bg-green-500"
        percentage = 100
      }

      return {
        score,
        label,
        color,
        percentage,
      }
    }

    setStrength(calculateStrength(password))
  }, [password])

  if (!password) return null

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 ease-in-out", strength.color)}
          style={{ width: `${strength.percentage}%` }}
        />
      </div>
      {strength.label && (
        <p
          className={cn(
            "text-xs font-medium",
            strength.label === "Weak" && "text-red-500",
            strength.label === "Medium" && "text-yellow-600",
            strength.label === "Strong" && "text-blue-600",
            strength.label === "Very Strong" && "text-green-600",
          )}
        >
          {strength.label}
        </p>
      )}
    </div>
  )
}
