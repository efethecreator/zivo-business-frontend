import { useQuery } from "@tanstack/react-query"
import { api } from "@/utils/api"

export function useBusinessAppointments(businessId: string) {
  return useQuery({
    queryKey: ["business-appointments", businessId],
    queryFn: async () => {
      const response = await api.get(`/v1/appointments/business/${businessId}`)
      return response.data
    },
    enabled: !!businessId, // businessId yoksa istek atma
  })
}
