import { useMutation } from "@tanstack/react-query";
import { createShiftTime } from "@/lib/shiftTime.service";
import { useToast } from "@/hooks/use-toast";

interface CreateShiftTimeData {
  startTime: string;
  endTime: string;
}

export function useCreateShiftTime() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateShiftTimeData) => createShiftTime(data),
    onError: (error: any) => {
      console.error("Shift time create error:", error);
      toast({
        title: "Çalışma Saati Kaydedilemedi",
        description: error?.message || "ShiftTime kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
}
