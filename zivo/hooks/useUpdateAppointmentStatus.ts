import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/utils/api"

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const response = await api.put(`/v1/appointments/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-appointments"] })
    },
  })
}
