import { GlassCard, GlassCardGrid } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FadeIn, SlideIn } from "@/components/ui/animations"
import { Calendar, Star, Phone, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HoverCardEnhanced } from "@/components/ui/hover-card-enhanced"

export function WorkersEnhanced() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Çalışanlar</h1>
          <p className="text-muted-foreground">Salonunuzda çalışan personeli yönetin ve düzenleyin.</p>
        </div>
      </FadeIn>

      <SlideIn direction="up">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Çalışan ara..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <GradientButton
              variant="outline"
              className="flex items-center gap-2"
              gradientFrom="from-gray-500"
              gradientTo="to-gray-400"
            >
              <Filter className="h-4 w-4" />
              <span>Filtrele</span>
            </GradientButton>
            <GradientButton
              className="flex items-center gap-2"
              gradientFrom="from-primary"
              gradientTo="to-primary/80"
              shimmer
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Çalışan</span>
            </GradientButton>
          </div>
        </div>
      </SlideIn>

      <GlassCardGrid>
        {workerData.map((worker, index) => (
          <WorkerCard key={index} worker={worker} delay={index * 0.1} />
        ))}
      </GlassCardGrid>
    </div>
  )
}

interface WorkerProps {
  worker: {
    name: string
    position: string
    rating: number
    appointments: number
    phone: string
    email: string
    specialties: string[]
    image: string
  }
  delay?: number
}

function WorkerCard({ worker, delay }: WorkerProps) {
  return (
    <GlassCard className="group overflow-hidden transition-all hover:shadow-lg" delay={delay}>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white/50 bg-white/10">
            <img src={worker.image || "/placeholder.svg"} alt={worker.name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -right-1 bottom-0 rounded-full bg-white p-1 shadow-sm">
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-700">{worker.rating}</span>
            </div>
          </div>
        </div>

        <h3 className="text-center text-lg font-medium">{worker.name}</h3>
        <p className="text-center text-sm text-muted-foreground">{worker.position}</p>

        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {worker.specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-white/10">
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">{worker.appointments}</span>
          </div>
          <HoverCardEnhanced
            trigger={
              <button className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">İletişim</span>
              </button>
            }
            width={220}
          >
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Telefon</p>
                <p className="text-sm font-medium">{worker.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-posta</p>
                <p className="text-sm font-medium">{worker.email}</p>
              </div>
            </div>
          </HoverCardEnhanced>
        </div>

        <div className="mt-4 flex w-full justify-between gap-2">
          <GradientButton
            variant="outline"
            size="sm"
            className="flex-1"
            gradientFrom="from-gray-500"
            gradientTo="to-gray-400"
          >
            Düzenle
          </GradientButton>
          <GradientButton size="sm" className="flex-1" gradientFrom="from-primary" gradientTo="to-primary/80">
            Takvim
          </GradientButton>
        </div>
      </div>
    </GlassCard>
  )
}

const workerData = [
  {
    name: "Ayşe Yılmaz",
    position: "Saç Stilisti",
    rating: 4.8,
    appointments: 24,
    phone: "+90 555 123 4567",
    email: "ayse@bellasalon.com",
    specialties: ["Kesim", "Renklendirme", "Fön"],
    image: "/default-avatar.png",
  },
  {
    name: "Mehmet Kaya",
    position: "Berber",
    rating: 4.9,
    appointments: 18,
    phone: "+90 555 234 5678",
    email: "mehmet@bellasalon.com",
    specialties: ["Sakal", "Kesim", "Şekillendirme"],
    image: "/default-avatar.png",
  },
  {
    name: "Zeynep Demir",
    position: "Tırnak Uzmanı",
    rating: 4.7,
    appointments: 15,
    phone: "+90 555 345 6789",
    email: "zeynep@bellasalon.com",
    specialties: ["Manikür", "Pedikür", "Protez Tırnak"],
    image: "/default-avatar.png",
  },
  {
    name: "Can Öztürk",
    position: "Cilt Bakım Uzmanı",
    rating: 4.6,
    appointments: 12,
    phone: "+90 555 456 7890",
    email: "can@bellasalon.com",
    specialties: ["Yüz Bakımı", "Maske", "Peeling"],
    image: "/default-avatar.png",
  },
]
