// zivo/app/(dashboard)/shifts/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthMe } from "@/hooks/useAuthMe";
import { useGetBusinessShifts } from "@/hooks/useBusinessShifts/useGetBusinessShifts";
import { useUpdateBusinessShift } from "@/hooks/useBusinessShifts/useUpdateBusinessShift";
import { useUpdateShiftTime } from "@/hooks/useUpdateShiftTime";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusinessHoursSelector } from "@/components/business-hours-selector";

export default function ShiftsPage() {
  const { toast } = useToast();
  const { data: authData } = useAuthMe();
  const businessId = authData?.businessId;

  const { data: businessShifts = [] } = useGetBusinessShifts(businessId);
  const updateBusinessShift = useUpdateBusinessShift();
  const updateShiftTime = useUpdateShiftTime();

  const [businessHours, setBusinessHours] = useState<Record<string, any>>({});

  const numberToDayName = (dayNumber: number) => {
    const days: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return days[dayNumber];
  };

  const dayNameToNumber = (day: string) => {
    const days: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };
    return days[day];
  };

  const padTime = (time: string) => {
    if (!time) return null;
    const [hour, minute] = time.split(":");
    if (hour == null || minute == null) return null;
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (businessShifts.length > 0) {
      setBusinessHours((prev) => {
        const updated = { ...prev };

        businessShifts.forEach((shift: any) => {
          const dayName = numberToDayName(shift.dayOfWeek);
          if (dayName && shift.shiftTime) {
            updated[dayName] = {
              ...updated[dayName],
              isOpen: shift.isActive,
              openTime: shift.shiftTime.startTime.slice(11, 16),
              closeTime: shift.shiftTime.endTime.slice(11, 16),
              shiftTimeId: shift.shiftTime.id,
              businessShiftId: shift.id,
            };
          }
        });

        return updated;
      });
    }
  }, [businessShifts]);

  const handleBusinessHoursChange = (
    day: string,
    field: string,
    value: any
  ) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const updatedState = { ...businessHours };

      for (const day in businessHours) {
        const { isOpen, openTime, closeTime, shiftTimeId, businessShiftId } =
          businessHours[day];

        if (!shiftTimeId || !businessShiftId) continue;

        const paddedOpen = padTime(openTime);
        const paddedClose = padTime(closeTime);
        if (!paddedOpen || !paddedClose) continue;

        // Saat değerlerini timezone'dan bağımsız ISO string'e çevirme
        const createTimeString = (timeStr: string) => {
          // Saati ve dakikayı ayır
          const [hours, minutes] = timeStr.split(":").map(Number);

          // Tarih nesnesini oluştur (2025-01-01 sabit tarih kullanıyoruz)
          const date = new Date(Date.UTC(2025, 0, 1, hours, minutes, 0));

          return date.toISOString();
        };

        const startTimeISO = createTimeString(paddedOpen);
        const endTimeISO = createTimeString(paddedClose);

        // 1. ShiftTime güncelle
        await updateShiftTime.mutateAsync({
          id: shiftTimeId,
          data: {
            startTime: startTimeISO,
            endTime: endTimeISO,
          },
        });

        // 2. BusinessShift güncelle
        await updateBusinessShift.mutateAsync({
          id: businessShiftId,
          data: {
            businessId,
            dayOfWeek: dayNameToNumber(day),
            shiftTimeId,
            isActive: isOpen,
          },
        });

        // Local state güncelle
        updatedState[day] = {
          ...updatedState[day],
          openTime,
          closeTime,
          isOpen,
        };
      }

      setBusinessHours(updatedState);

      toast({
        title: "Successful",
        description: "Business hours updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving business hours:", error);
      toast({
        title: "Could not save business hours",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Business Hours
        </h1>
        <Button
          onClick={handleSave}
          className="transition-all duration-200 hover:shadow-sm"
        >
          Save Changes
        </Button>
      </div>

      <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30">
          <CardTitle>Business Hours Management</CardTitle>
          <CardDescription>
            You can edit your business hours from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessHoursSelector
            businessHours={businessHours}
            onChange={handleBusinessHoursChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
