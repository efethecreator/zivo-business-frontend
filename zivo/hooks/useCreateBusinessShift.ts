import { useMutation } from "@tanstack/react-query";
import { createBusinessShift } from "../lib/businessShift.service";
import { useToast } from "@/hooks/use-toast";

interface CreateBusinessShiftInput {
  businessId: string;
  dayOfWeek: number;
  shiftTimeId: string;
}

export function useCreateBusinessShift() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBusinessShiftInput) => createBusinessShift(data),
    onError: (error: any) => {
      console.error("Business shift create error:", error);
      toast({
        title: "Çalışma Saati Eklenemedi",
        description:
          error?.message || "Çalışma saati kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
}

