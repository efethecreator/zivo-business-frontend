// zivo/app/components/business-hours-selector.tsx

"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BusinessHour {
  isOpen: boolean
  openTime: string
  closeTime: string
  shiftTimeId?: string
  businessShiftId?: string
}

interface BusinessHours {
  [key: string]: BusinessHour
}

interface BusinessHoursSelectorProps {
  businessHours: BusinessHours
  onChange: (day: string, field: keyof BusinessHour, value: any) => void
}

export function BusinessHoursSelector({ businessHours, onChange }: BusinessHoursSelectorProps) {
  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ]

  const timeOptions: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium">Set your business hours</div>

      <div className="space-y-4">
        {days.map((day) => {
          const current = businessHours[day.id]
          return (
            <div key={day.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <Switch
                  id={`${day.id}-switch`}
                  checked={current?.isOpen ?? false}
                  onCheckedChange={(checked) => onChange(day.id, "isOpen", checked)}
                />
                <Label htmlFor={`${day.id}-switch`} className="font-medium">
                  {day.label}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Select
                  value={current?.openTime ?? ""}
                  onValueChange={(value) => onChange(day.id, "openTime", value)}
                  disabled={!current?.isOpen}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Opening" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`${day.id}-open-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground">-</span>

                <Select
                  value={current?.closeTime ?? ""}
                  onValueChange={(value) => onChange(day.id, "closeTime", value)}
                  disabled={!current?.isOpen}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Closing" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`${day.id}-close-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
