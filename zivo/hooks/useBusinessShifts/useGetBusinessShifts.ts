import { useQuery } from "@tanstack/react-query";
import { getBusinessShifts } from "@/lib/businessShift.service";

export const useGetBusinessShifts = (businessId: string | undefined) => {
  return useQuery({
    queryKey: ["business-shifts", businessId],
    queryFn: () => {
      if (!businessId) throw new Error("Business ID yok");
      return getBusinessShifts(businessId);
    },
    enabled: !!businessId,
    refetchOnWindowFocus: false,
  });
};
