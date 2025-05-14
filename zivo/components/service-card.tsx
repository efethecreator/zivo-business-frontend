"use client"

import { Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  price: number
  duration: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export function ServiceCard({
  id,
  title,
  description,
  price,
  duration,
  onEdit,
  onDelete,
  className,
}: ServiceCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-soft-lg", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3">
        <CardTitle className="text-lg font-semibold text-primary-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm">
            <DollarSign className="mr-2 h-4 w-4 text-primary" />
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 p-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit?.(id)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete?.(id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
