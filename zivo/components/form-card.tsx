"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormCardProps {
  title: string
  description?: string
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  submitDisabled?: boolean
  footer?: React.ReactNode
}

export function FormCard({
  title,
  description,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  submitDisabled = false,
  footer,
}: FormCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-soft", className)}>
      <form onSubmit={onSubmit}>
        <CardHeader className={cn("pb-2", headerClassName)}>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className={cn("p-6 space-y-breathing", contentClassName)}>{children}</CardContent>
        <CardFooter className={cn("border-t bg-muted/20 p-4 flex justify-end gap-3", footerClassName)}>
          {footer ? (
            footer
          ) : (
            <>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting || submitDisabled}>
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
