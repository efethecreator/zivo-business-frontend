import { GlassCard, GlassCardGrid } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FadeIn, SlideIn } from "@/components/ui/animations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scissors, Clock, DollarSign, Plus, Search, Filter, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ServicesEnhanced() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Hizmetler</h1>
          <p className="text-muted-foreground">Salonunuzda sunduğunuz hizmetleri yönetin ve düzenleyin.</p>
        </div>
      </FadeIn>

      <SlideIn direction="up">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Hizmet ara..." className="pl-9" />
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
              <span>Yeni Hizmet</span>
            </GradientButton>
          </div>
        </div>
      </SlideIn>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="hair">Saç</TabsTrigger>
          <TabsTrigger value="nails">Tırnak</TabsTrigger>
          <TabsTrigger value="skin">Cilt Bakımı</TabsTrigger>
          <TabsTrigger value="makeup">Makyaj</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <GlassCardGrid>
            {serviceData.map((service, index) => (
              <ServiceCard key={index} service={service} delay={index * 0.1} />
            ))}
          </GlassCardGrid>
        </TabsContent>

        <TabsContent value="hair" className="mt-0">
          <GlassCardGrid>
            {serviceData
              .filter((s) => s.category === "Saç")
              .map((service, index) => (
                <ServiceCard key={index} service={service} delay={index * 0.1} />
              ))}
          </GlassCardGrid>
        </TabsContent>

        <TabsContent value="nails" className="mt-0">
          <GlassCardGrid>
            {serviceData
              .filter((s) => s.category === "Tırnak")
              .map((service, index) => (
                <ServiceCard key={index} service={service} delay={index * 0.1} />
              ))}
          </GlassCardGrid>
        </TabsContent>

        <TabsContent value="skin" className="mt-0">
          <GlassCardGrid>
            {serviceData
              .filter((s) => s.category === "Cilt Bakımı")
              .map((service, index) => (
                <ServiceCard key={index} service={service} delay={index * 0.1} />
              ))}
          </GlassCardGrid>
        </TabsContent>

        <TabsContent value="makeup" className="mt-0">
          <GlassCardGrid>
            {serviceData
              .filter((s) => s.category === "Makyaj")
              .map((service, index) => (
                <ServiceCard key={index} service={service} delay={index * 0.1} />
              ))}
          </GlassCardGrid>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ServiceProps {
  service: {
    name: string
    description: string
    price: number
    duration: number
    category: string
    popular?: boolean
  }
  delay?: number
}

function ServiceCard({ service, delay }: ServiceProps) {
  return (
    <GlassCard className="group relative overflow-hidden transition-all hover:shadow-lg" delay={delay}>
      <div className="absolute -right-12 -top-12 h-24 w-24 rotate-45 bg-gradient-to-br from-primary/20 to-primary/10 transition-all group-hover:from-primary/30 group-hover:to-primary/20" />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{service.name}</h3>
            {service.popular && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Popüler
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Scissors className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{service.duration} dk</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>{service.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-4 w-4" />
          <span>{service.price} ₺</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <GradientButton variant="outline" size="sm" gradientFrom="from-gray-500" gradientTo="to-gray-400">
          Düzenle
        </GradientButton>
        <GradientButton size="sm" gradientFrom="from-primary" gradientTo="to-primary/80">
          Randevu Oluştur
        </GradientButton>
      </div>
    </GlassCard>
  )
}

const serviceData = [
  {
    name: "Saç Kesimi",
    description: "Profesyonel saç kesimi ve şekillendirme",
    price: 150,
    duration: 45,
    category: "Saç",
    popular: true,
  },
  {
    name: "Saç Boyama",
    description: "Tek renk saç boyama işlemi",
    price: 350,
    duration: 120,
    category: "Saç",
  },
  {
    name: "Manikür",
    description: "Klasik manikür uygulaması",
    price: 120,
    duration: 40,
    category: "Tırnak",
  },
  {
    name: "Pedikür",
    description: "Klasik pedikür uygulaması",
    price: 150,
    duration: 50,
    category: "Tırnak",
  },
  {
    name: "Cilt Bakımı",
    description: "Derin temizlik ve nemlendirme",
    price: 280,
    duration: 60,
    category: "Cilt Bakımı",
    popular: true,
  },
  {
    name: "Gelin Makyajı",
    description: "Özel gün için profesyonel makyaj",
    price: 500,
    duration: 90,
    category: "Makyaj",
  },
]
