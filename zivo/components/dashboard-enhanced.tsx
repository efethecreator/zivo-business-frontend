import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FadeIn, SlideIn, ScaleIn } from "@/components/ui/animations"
import { Button } from "@/components/ui/button"
import { HoverCardEnhanced } from "@/components/ui/hover-card-enhanced"
import { Clock, Users, Scissors, CreditCard, TrendingUp, Calendar, CheckCircle } from "lucide-react"

export function DashboardEnhanced() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
          <p className="text-muted-foreground">
            Salonunuzun güncel durumunu ve istatistiklerini buradan takip edebilirsiniz.
          </p>
        </div>
      </FadeIn>

      {/* Stats Overview */}
      <SlideIn direction="up" delay={0.1}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bugünkü Randevular</p>
                <h3 className="mt-1 text-2xl font-bold">
                  <AnimatedCounter value={12} />
                </h3>
              </div>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tamamlanan</p>
                <h3 className="mt-1 text-2xl font-bold">
                  <AnimatedCounter value={8} />
                </h3>
              </div>
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Müşteriler</p>
                <h3 className="mt-1 text-2xl font-bold">
                  <AnimatedCounter value={156} />
                </h3>
              </div>
              <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Günlük Gelir</p>
                <h3 className="mt-1 text-2xl font-bold">
                  <AnimatedCounter value={2850} prefix="₺" />
                </h3>
              </div>
              <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        </div>
      </SlideIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <ScaleIn delay={0.2} className="lg:col-span-2">
          <GlassCard
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Yaklaşan Randevular</h3>
                <HoverCardEnhanced
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <span className="sr-only">Bilgi</span>
                      <Clock className="h-4 w-4" />
                    </Button>
                  }
                >
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">Randevu Durumları</h4>
                    <p className="text-sm text-muted-foreground">
                      Bugünkü ve yaklaşan randevularınızı buradan takip edebilirsiniz.
                    </p>
                  </div>
                </HoverCardEnhanced>
              </div>
            }
          >
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Ayşe Yılmaz</p>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        14:30
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Saç Kesimi, Fön</p>
                  </div>
                </div>
              ))}
              <GradientButton className="w-full" gradientFrom="from-primary" gradientTo="to-primary/80" shimmer>
                Tüm Randevuları Görüntüle
              </GradientButton>
            </div>
          </GlassCard>
        </ScaleIn>

        {/* Performance */}
        <ScaleIn delay={0.3}>
          <GlassCard
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Performans</h3>
                <HoverCardEnhanced
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <span className="sr-only">Bilgi</span>
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  }
                >
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">Performans Metrikleri</h4>
                    <p className="text-sm text-muted-foreground">
                      Son 7 günlük performans verileriniz burada gösterilmektedir.
                    </p>
                  </div>
                </HoverCardEnhanced>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Randevu Doluluk</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-primary to-primary/80" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Müşteri Memnuniyeti</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-green-500 to-green-400" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Haftalık Büyüme</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                  <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                </div>
              </div>

              <div className="pt-2">
                <GradientButton
                  variant="outline"
                  className="w-full"
                  gradientFrom="from-primary"
                  gradientTo="to-primary/80"
                >
                  Detaylı Rapor
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </ScaleIn>
      </div>
    </div>
  )
}
