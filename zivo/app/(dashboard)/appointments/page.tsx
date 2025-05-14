"use client";

import { useState } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  MoreHorizontal,
  Search,
  CalendarIcon,
  Calendar,
  PlusCircle,
  Clock,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthMe } from "@/hooks/useAuthMe";
import { useBusinessAppointments } from "@/hooks/useBusinessAppointments";
import { useUpdateAppointmentStatus } from "@/hooks/useUpdateAppointmentStatus";
import { StatusBadge } from "@/components/ui/status-badge";

const statusNames = {
  confirmed: "confirmed",
  pending: "pending",
  cancelled: "cancelled",
} as const;

const statusColors = {
  confirmed: "bg-green-600",
  pending: "bg-amber-500",
  cancelled: "bg-red-600",
} as const;

type AppointmentStatus = keyof typeof statusNames;

interface Appointment {
  id: string;
  appointmentTime: string;
  status: AppointmentStatus;
  totalPrice: string;
  customer: {
    phone: string;
    photoUrl: string;
    user: {
      fullName: string;
    };
  };
  worker: {
    firstName: string;
    lastName: string;
  };
  appointmentServices: {
    service: {
      name: string;
    };
  }[];
}

export default function AppointmentsPage() {
  const { toast } = useToast();
  const { data: user } = useAuthMe();
  const businessId = user?.businessId || "";

  const { data: appointments = [], isLoading } =
    useBusinessAppointments(businessId);
  const updateStatusMutation = useUpdateAppointmentStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "d MMMM yyyy", { locale: tr });
  const formatShortDate = (date: Date) => format(date, "d MMM", { locale: tr });
  const formatDayName = (date: Date) => format(date, "EEEE", { locale: tr });

  const formatUTCDate = (isoString: string) => {
    if (!isoString) return "--/--/----";
    return isoString.slice(0, 10);
  };

  const formatUTCTime = (isoString: string) => {
    if (!isoString) return "--:--";
    return isoString.slice(11, 16);
  };

  const filteredAppointments = appointments.filter(
    (appointment: Appointment) => {
      const search = searchTerm.toLowerCase();

      const customerMatch = appointment.customer.user.fullName
        .toLowerCase()
        .includes(search);

      const servicesMatch = appointment.appointmentServices.some((s) =>
        s.service.name.toLowerCase().includes(search)
      );

      const workerMatch =
        appointment.worker.firstName.toLowerCase().includes(search) ||
        appointment.worker.lastName.toLowerCase().includes(search);

      const matchesSearch = customerMatch || servicesMatch || workerMatch;

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        isSameDay(new Date(appointment.appointmentTime), dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    }
  );

  const updateAppointmentStatus = (
    id: string,
    newStatus: AppointmentStatus
  ) => {
    updateStatusMutation.mutate({ id, status: newStatus });
    toast({
      title: "Appointment updated",
      description: `Status changed to "${statusNames[newStatus]}".`,
    });
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => setCurrentWeek(subDays(currentWeek, 7));
  const goToNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
  const goToToday = () => {
    setCurrentWeek(new Date());
    setDateFilter(new Date());
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Appointments
      </h1>

      {currentView === "list" ? (
        <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle>Appointment List</CardTitle>
            <CardDescription>
              View and manage all your appointments.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-3 ">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                <Input
                  placeholder="Search customer, service or staff..."
                  className="pl-8 transition-all duration-200 border-muted focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[150px] transition-all duration-200 hover:border-primary">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[150px] justify-start text-left font-normal transition-all duration-200 hover:border-primary"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter
                        ? formatDate(dateFilter.toISOString())
                        : "Select Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateFilter}
                      onSelect={(date) => setDateFilter(date)}
                      initialFocus
                    />
                    <div className="flex items-center justify-between p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateFilter(undefined)}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setDateFilter(new Date())}
                      >
                        Today
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* Tablo */}
            <div className="overflow-x-auto rounded-md border">
              <div className="max-h-[483px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm z-10">
                    <tr className="bg-muted/30">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Services
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Staff
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment: Appointment) => {
                        const date: Date = new Date(
                          appointment.appointmentTime
                        );
                        const time: string = formatUTCTime(appointment.appointmentTime)

                        return (
                          <tr
                            key={appointment.id}
                            className="hover:bg-muted/30 transition-colors duration-200"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      appointment.customer?.photoUrl ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback>
                                    {appointment.customer?.user?.fullName
                                      ?.split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {appointment.customer?.user?.fullName ||
                                      "Customer"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {appointment.customer?.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {appointment.appointmentServices
                                ?.map(
                                  (s: { service: { name: string } }) =>
                                    s.service.name
                                )
                                .join(", ")}
                            </td>
                            <td className="px-4 py-3">
                              {appointment.worker
                                ? `${appointment.worker.firstName} ${appointment.worker.lastName}`
                                : "-"}
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(appointment.appointmentTime)}
                            </td>
                            <td className="px-4 py-3">{time}</td>
                            <td className="px-4 py-3">
                              <StatusBadge status={appointment.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="animate-in fade-in-50 zoom-in-95 duration-100"
                                >
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setIsDetailsOpen(true);
                                    }}
                                    className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer"
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                  {appointment.status !== "confirmed" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "confirmed"
                                        )
                                      }
                                      className="transition-colors duration-200 hover:bg-green-50 hover:text-green-600 cursor-pointer"
                                    >
                                      Confirm
                                    </DropdownMenuItem>
                                  )}
                                  {appointment.status !== "pending" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "pending"
                                        )
                                      }
                                      className="transition-colors duration-200 hover:bg-amber-50 hover:text-amber-600 cursor-pointer"
                                    >
                                      Pending
                                    </DropdownMenuItem>
                                  )}
                                  {appointment.status !== "cancelled" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "cancelled"
                                        )
                                      }
                                      className="transition-colors duration-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                    >
                                      Cancel
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="relative mb-6">
                              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-primary" />
                              </div>
                              <div className="absolute -bottom-2 -right-2 bg-primary/20 p-2 rounded-full">
                                <Clock className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <h3 className="text-xl font-medium text-center mb-2">
                              No appointments found
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                              {searchTerm ||
                              statusFilter !== "all" ||
                              dateFilter ? (
                                <>
                                  No appointments match your current filters.
                                  Try adjusting your search criteria or
                                  selecting a different date.
                                </>
                              ) : (
                                <>
                                  You don't have any appointments scheduled yet.
                                  When customers book appointments, they will
                                  appear here.
                                </>
                              )}
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                              {(searchTerm ||
                                statusFilter !== "all" ||
                                dateFilter) && (
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-2"
                                  onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setDateFilter(undefined);
                                  }}
                                >
                                  <Filter className="h-4 w-4" />
                                  Clear all filters
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      )}

      {/* Randevu Detayları Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment information.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      selectedAppointment.customer?.photoUrl ||
                      "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {selectedAppointment.customer?.user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">
                    {selectedAppointment.customer?.user?.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.customer?.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Services</Label>
                  <p>
                    {selectedAppointment.appointmentServices
                      .map((s) => s.service.name)
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <Label>Staff</Label>
                  <p>
                    {selectedAppointment.worker
                      ? `${selectedAppointment.worker.firstName} ${selectedAppointment.worker.lastName}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p>{formatDate(selectedAppointment.appointmentTime)}</p>
                </div>
                <div>
                  <Label>Time</Label>
                  <p>
                    {format(
                      new Date(selectedAppointment.appointmentTime),
                      "HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <Label>Total Price</Label>
                  <p>₺{selectedAppointment.totalPrice}</p>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <StatusBadge status={selectedAppointment.status} />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
