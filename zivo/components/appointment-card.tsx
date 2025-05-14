"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, Clock, User } from "lucide-react"

interface AppointmentCardProps {
  title: string
  date: string
  time: string
  customer: string
  status: string
  onViewDetails?: () => void
  className?: string
}

export function AppointmentCard({
  title,
  date,
  time,
  customer,
  status,
  onViewDetails,
  className,
}: AppointmentCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <StatusBadge status={status} className="mt-2" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{customer}</span>
          </div>
        </div>
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails} className="w-full">
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
