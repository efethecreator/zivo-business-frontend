"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormattedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  formatter?: (value: string) => string
  validator?: (value: string) => { isValid: boolean; message: string }
  onValueChange?: (value: string) => void
  showValidation?: boolean
}

export function FormattedInput({
  label,
  formatter,
  validator,
  onValueChange,
  showValidation = true,
  className,
  ...props
}: FormattedInputProps) {
  const [value, setValue] = useState(props.value?.toString() || "")
  const [displayValue, setDisplayValue] = useState(props.value?.toString() || "")
  const [validation, setValidation] = useState<{ isValid: boolean; message: string } | null>(null)
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value.toString())
      setDisplayValue(formatter ? formatter(props.value.toString()) : props.value.toString())
    }
  }, [props.value, formatter])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Apply formatter if provided
    if (formatter) {
      const formattedValue = formatter(newValue)
      setDisplayValue(formattedValue)
      e.target.value = formattedValue
    } else {
      setDisplayValue(newValue)
    }

    // Apply validator if provided
    if (validator && isTouched && showValidation) {
      setValidation(validator(newValue))
    }

    // Call original onChange if provided
    if (props.onChange) {
      props.onChange(e)
    }

    // Call onValueChange with the raw value
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true)

    // Apply validator on blur if provided
    if (validator && showValidation) {
      setValidation(validator(value))
    }

    // Call original onBlur if provided
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(validation && !validation.isValid && isTouched ? "border-red-500" : "", className)}
      />
      {validation && isTouched && showValidation && (
        <p className={`text-xs ${validation.isValid ? "text-green-500" : "text-red-500"}`}>{validation.message}</p>
      )}
    </div>
  )
}
