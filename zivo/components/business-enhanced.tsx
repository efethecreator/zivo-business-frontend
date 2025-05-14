import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { FadeIn, SlideIn } from "@/components/ui/animations"
import { MapPin, Clock, Phone, Info, Edit, Building, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BusinessEnhanced() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">İşletme Bilgileri</h1>
          <p className="text-muted-foreground">İşletmenizin temel bilgilerini görüntüleyin ve düzenleyin.</p>
        </div>
      </FadeIn>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Genel Bilgiler</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Çalışma Saatleri</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Konum</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-0">
          <SlideIn direction="up">
            <GlassCard className="overflow-hidden">
              <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-primary/80 to-primary/40">
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                    <img src="/default-avatar.png" alt="Business Logo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Bella Salon</h2>
                    <p className="text-sm text-white/80">Premium Güzellik Merkezi</p>
                  </div>
                </div>
                <GradientButton
                  size="sm"
                  className="absolute right-4 top-4"
                  gradientFrom="from-white/20"
                  gradientTo="to-white/10"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </GradientButton>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <Building className="h-5 w-5 text-primary" />
                      İşletme Detayları
                    </h3>
                    <div className="mt-3 space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="text-sm text-muted-foreground">İşletme Adı</p>
                        <p className="font-medium">Bella Salon</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">İşletme Türü</p>
                        <p className="font-medium">Güzellik Salonu</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Açıklama</p>
                        <p className="font-medium">Premium güzellik ve bakım hizmetleri sunan profesyonel bir salon.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                      <Phone className="h-5 w-5 text-primary" />
                      İletişim Bilgileri
                    </h3>
                    <div className="mt-3 space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Telefon</p>
                        <p className="font-medium">+90 555 123 4567</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">E-posta</p>
                        <p className="font-medium">info@bellasalon.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Web Sitesi</p>
                        <p className="font-medium">www.bellasalon.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <GradientButton variant="outline" gradientFrom="from-primary" gradientTo="to-primary/80">
                  <Globe className="mr-2 h-4 w-4" />
                  Profili Görüntüle
                </GradientButton>
                <GradientButton gradientFrom="from-primary" gradientTo="to-primary/80" shimmer>
                  <Edit className="mr-2 h-4 w-4" />
                  Bilgileri Düzenle
                </GradientButton>
              </div>
            </GlassCard>
          </SlideIn>
        </TabsContent>

        <TabsContent value="hours" className="mt-0">
          <SlideIn direction="up">
            <GlassCard>
              <h3 className="mb-4 text-lg font-medium">Çalışma Saatleri</h3>
              <div className="space-y-3">
                {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((day, index) => (
                  <div
                    key={day}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    <span className="font-medium">{day}</span>
                    <span>{index < 5 ? "09:00 - 20:00" : index === 5 ? "10:00 - 18:00" : "Kapalı"}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <GradientButton gradientFrom="from-primary" gradientTo="to-primary/80" shimmer>
                  <Edit className="mr-2 h-4 w-4" />
                  Saatleri Düzenle
                </GradientButton>
              </div>
            </GlassCard>
          </SlideIn>
        </TabsContent>

        <TabsContent value="location" className="mt-0">
          <SlideIn direction="up">
            <GlassCard>
              <h3 className="mb-4 text-lg font-medium">Konum Bilgileri</h3>
              <div className="mb-4 h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                {/* Map placeholder */}
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="font-medium">Atatürk Bulvarı No:123, Kızılay, Ankara</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posta Kodu</p>
                  <p className="font-medium">06420</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <GradientButton gradientFrom="from-primary" gradientTo="to-primary/80" shimmer>
                  <Edit className="mr-2 h-4 w-4" />
                  Konumu Düzenle
                </GradientButton>
              </div>
            </GlassCard>
          </SlideIn>
        </TabsContent>
      </Tabs>
    </div>
  )
}
