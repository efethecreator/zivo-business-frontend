"use client"

import { Mail, Phone } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ContactCardProps {
  id: string
  name: string
  email?: string
  phone?: string
  avatarUrl?: string
  onViewDetails?: (id: string) => void
  onEdit?: (id: string) => void
  className?: string
}

export function ContactCard({ id, name, email, phone, avatarUrl, onViewDetails, onEdit, className }: ContactCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-soft-lg", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3 flex flex-row items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg font-semibold text-primary-900">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {email && (
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-primary" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-primary" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/20 p-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onViewDetails?.(id)}>
          View Details
        </Button>
        <Button size="sm" onClick={() => onEdit?.(id)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  )
}
