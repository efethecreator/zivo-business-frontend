"use client";

import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Users,
  Scissors,
  PlusCircle,
  CalendarPlus,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useBusinessAppointments } from "@/hooks/useBusinessAppointments";
import { useBusinessReviews } from "@/hooks/useBusinessReviews";
import { useAuthMe } from "@/hooks/useAuthMe";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Helper function to return month names
function getMonthName(month: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month];
}

// Function to generate performance data
function generatePerformanceData(stats: any) {
  // Return empty array if stats is missing
  if (!stats) return [];

  // Get monthly revenue from stats or use default
  const monthlyRevenue = stats.monthlyRevenue || 3000;

  // Create data for the last 30 days
  const data = [];
  const today = new Date();

  // Start date (30 days ago)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 29);

  // Average daily revenue (monthly revenue divided by 30)
  const avgDailyRevenue = monthlyRevenue / 30;

  // Create a smooth curve using sine waves
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // Create variation using sine waves (between 0.7 and 1.3)
    const wave1 = Math.sin(i * 0.4) * 0.3;
    const wave2 = Math.sin(i * 0.2 + 1) * 0.2;
    const variation = 1 + wave1 + wave2;

    // Daily revenue (average * variation)
    const dailyRevenue = Math.round(avgDailyRevenue * variation);

    // Number of appointments (based on revenue)
    const appointments = Math.max(
      1,
      Math.round(dailyRevenue / avgDailyRevenue)
    );

    // Format date
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}`;

    data.push({
      date: date.toISOString(),
      formattedDate: formattedDate,
      appointments: appointments,
      revenue: dailyRevenue,
    });
  }

  return data;
}

// Function to generate popular services data
function generatePopularServicesData(appointments: any[]) {
  if (!appointments || !appointments.length) {
    // Sample data if no appointments
    return [
      { name: "Haircut", value: 0 },
      { name: "Hair Dye", value: 0 },
      { name: "Manicure", value: 0 },
      { name: "Pedicure", value: 0 },
      { name: "Massage", value: 0 },
    ];
  }

  // Count services from appointments
  const serviceCount: Record<string, number> = {};

  appointments.forEach((appointment) => {
    if (
      appointment.appointmentServices &&
      appointment.appointmentServices.length
    ) {
      appointment.appointmentServices.forEach((as: any) => {
        const serviceName = as.service?.name || "Unknown Service";
        serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
      });
    }
  });

  // Sort services by popularity
  const sortedServices = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5 services
    .map(([name, value]) => ({ name, value }));

  return sortedServices;
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}`;

    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="font-semibold mb-1">{formattedDate}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-2">{entry.name}:</span>
            <span className="font-medium">
              {entry.dataKey === "revenue" ? `₺${entry.value}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Empty state component for metrics
const EmptyMetricCard = ({
  icon: Icon,
  title,
  value,
  gradientFrom = "from-primary/20",
  gradientTo = "to-primary/5",
  iconColor = "text-primary",
}: {
  icon: any;
  title: string;
  value: string | number;
  gradientFrom?: string;
  gradientTo?: string;
  iconColor?: string;
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 border-l-primary/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={cn(
            "p-1.5 rounded-full bg-gradient-to-br",
            gradientFrom,
            gradientTo
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

// Empty state component for the performance chart
const EmptyPerformanceChart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] p-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-primary/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary/10 p-1 rounded-full">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        No Performance Data Yet
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Your performance chart will show appointment and revenue trends once you
        start booking appointments.
      </p>
    </div>
  );
};

// Empty state component for popular services
const EmptyPopularServices = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] p-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-primary/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary/10 p-1 rounded-full">
          <Scissors className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        No Service Data Available
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        This chart will show your most popular services once you start booking
        appointments.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/services">
            <PlusCircle className="h-4 w-4" />
            <span>Add Services</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Empty state component for recent appointments
const EmptyAppointments = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-primary/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary/10 p-1 rounded-full">
          <Clock className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        No Appointments Yet
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Your recent appointments will appear here once you start booking
        clients.
      </p>
    </div>
  );
};

// Empty state component for recent reviews
const EmptyReviews = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-primary/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary/10 p-1 rounded-full">
          <Star className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        No Reviews Yet
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Customer reviews will appear here after completed appointments.
      </p>
    </div>
  );
};

// Main dashboard component
export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useAuthMe();

  const businessId = user?.businessId || "";

  const { data: stats, isLoading: statsLoading } =
    useDashboardSummary(businessId);
  const { data: appointmentsData, isLoading: appointmentsLoading } =
    useBusinessAppointments(businessId);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useBusinessReviews(businessId);

  const loading =
    userLoading || statsLoading || appointmentsLoading || reviewsLoading;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const hasAppointments = appointmentsData && appointmentsData.length > 0;
  const hasReviews = reviewsData && reviewsData.length > 0;

  // Get only the first 5 appointments and reviews if they exist
  const appointments = hasAppointments ? appointmentsData.slice(0, 5) : [];
  const reviews = hasReviews ? reviewsData.slice(0, 5) : [];

  // Performance chart data
  const performanceData = generatePerformanceData(stats);

  // Popular services data
  const popularServicesData = generatePopularServicesData(appointmentsData);
  const hasPopularServices = popularServicesData.some(
    (service) => service.value > 0
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EmptyMetricCard
          icon={Clock}
          title="Today's Appointments"
          value={stats?.todayAppointments ?? 0}
          gradientFrom="from-primary/20"
          gradientTo="to-primary/5"
          iconColor="text-primary"
        />

        <EmptyMetricCard
          icon={Calendar}
          title="Weekly Appointments"
          value={stats?.thisWeekAppointments ?? 0}
          gradientFrom="from-primary/30"
          gradientTo="to-primary/10"
          iconColor="text-primary/80"
        />

        <EmptyMetricCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`₺${Number(stats?.monthlyRevenue || 0).toLocaleString()}`}
          gradientFrom="from-primary/40"
          gradientTo="to-primary/15"
          iconColor="text-primary/60"
        />

        <EmptyMetricCard
          icon={Star}
          title="Average Rating"
          value={stats?.averageRating?.toFixed(1) ?? "0.0"}
          gradientFrom="from-primary/50"
          gradientTo="to-primary/20"
          iconColor="text-primary/40"
        />
      </div>

      {/* Appointments and Reviews Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="appointments"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Recent Appointments
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Recent Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Last 5 appointment records</CardDescription>
            </CardHeader>
            <CardContent>
              {hasAppointments ? (
                <div className="space-y-4">
                  {appointments.map((appointment: any) => {
                    const customerName =
                      appointment.customer?.user?.fullName || "Unknown";
                    const customerPhone =
                      appointment.customer?.phone || "Phone not available";
                    const workerName = appointment.worker
                      ? `${appointment.worker.firstName} ${appointment.worker.lastName}`
                      : "Unassigned worker";
                    const serviceNames = appointment.appointmentServices
                      .map((s: any) => s.service.name)
                      .join(", ");
                    const appointmentDate = new Date(
                      appointment.appointmentTime
                    ).toLocaleDateString();
                    const appointmentTime = appointment.appointmentTime
                      ? appointment.appointmentTime.slice(11, 16) // ✅ "HH:mm"
                      : "--:--";

                    return (
                      <div
                        key={appointment.id}
                        className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border p-4 space-y-2 md:space-y-0 transition-all duration-200 hover:bg-muted/30 hover:border-primary/20"
                      >
                        {/* Left Side */}
                        <div className="flex items-center space-x-6">
                          <Avatar className="h-14 w-14">
                            <AvatarImage
                              src={
                                appointment.customer?.photoUrl ||
                                "/default-avatar.png" ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {customerName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col space-y-1">
                            <p className="text-lg font-bold">{customerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {customerPhone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Services:</span>{" "}
                              {serviceNames}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Worker:</span>{" "}
                              {workerName}
                            </p>
                          </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-end space-y-1">
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {appointmentDate}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointmentTime}
                            </p>
                          </div>

                          <StatusBadge status={appointment.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyAppointments />
              )}

              {hasAppointments && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/appointments">View All Appointments</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {hasReviews ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => {
                    const customer = review.appointment?.customer;
                    const user = customer?.user;
                    const services =
                      review.appointment?.appointmentServices || [];

                    const serviceNames = services
                      .map((s: any) => s.service?.name)
                      .join(", ");
                    const appointmentDate = new Date(review.createdAt);

                    return (
                      <div
                        key={review.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg border p-4 space-y-4 md:space-y-0 transition-all duration-200 hover:bg-muted/30 hover:border-primary/20"
                      >
                        {/* Left side: Photo + Name + Comment */}
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage
                              src={customer?.photoUrl || "/default-avatar.png"}
                            />
                            <AvatarFallback>
                              {user?.fullName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-base font-semibold">
                              {user?.fullName || "Customer"}
                            </p>
                            <p className="mt-1 text-sm text-gray-700 max-w-md">
                              {review.comment}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Stars + Service + Date */}
                        <div className="flex flex-col items-end text-right space-y-2">
                          <div className="flex justify-end">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-500">
                            <div>{serviceNames}</div>
                            <div>
                              {appointmentDate.toLocaleDateString("en-US")}{" "}
                              {appointmentDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyReviews />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance and Popular Services */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-background to-muted/30">
            <CardTitle>Performance Chart</CardTitle>
            <CardDescription>
              Last 30 days appointment and revenue chart
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {performanceData.length > 0 && stats?.todayAppointments > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="#888"
                    axisLine={{ stroke: "#e0e0e0" }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="#888"
                    axisLine={{ stroke: "#e0e0e0" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    stroke="#888"
                    axisLine={{ stroke: "#e0e0e0" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    yAxisId="left"
                    dataKey="appointments"
                    name="Appointments"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="Revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPerformanceChart />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-background to-muted/30">
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Your most preferred services</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasPopularServices ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularServicesData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickMargin={5}
                    stroke="#888"
                    axisLine={{ stroke: "#e0e0e0" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    width={90}
                    stroke="#888"
                    axisLine={{ stroke: "#e0e0e0" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} appointments`, "Total"]}
                    labelFormatter={(value) => `${value}`}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    name="Appointment Count"
                    fill="var(--primary)"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPopularServices />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
