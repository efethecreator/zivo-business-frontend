import { useQuery } from "@tanstack/react-query";
import { getBusinessReviews } from "@/lib/dashboard.service";

export function useBusinessReviews(businessId: string) {
  return useQuery({
    queryKey: ["business-reviews", businessId],
    queryFn: () => getBusinessReviews(businessId),
    enabled: !!businessId,
  });
}
