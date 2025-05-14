import { Briefcase, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface WorkerCardProps {
  id: string
  name: string
  position: string
  email?: string
  phone?: string
  avatarUrl?: string
  skills?: string[]
  onViewDetails?: (id: string) => void
  onEdit?: (id: string) => void
  className?: string
}

export function WorkerCard({
  id,
  name,
  position,
  email,
  phone,
  avatarUrl,
  skills,
  onViewDetails,
  onEdit,
  className,
}: WorkerCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-soft-lg", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-3 flex flex-row items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold text-primary-900">{name}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Briefcase className="mr-1 h-3 w-3" />
            <span>{position}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-3">
          {email && (
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-primary" />
              <span>{email}</span>
            </div>
          )}
          {phone && (

\
