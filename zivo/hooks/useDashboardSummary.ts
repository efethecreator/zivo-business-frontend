import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/dashboard.service";

export function useDashboardSummary(businessId: string) {
  return useQuery({
    queryKey: ["dashboard-summary", businessId],
    queryFn: () => getDashboardSummary(businessId),
    enabled: !!businessId, // businessId yoksa request atma
  });
}
