import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getBusinessContacts,
  updateBusinessContacts,
  createBusinessContact,
  deleteBusinessContact,
} from "@/lib/businessContact.service"

export const useCreateBusinessContact = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: createBusinessContact,
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["businessContacts", variables.businessId] })
      },
    })
  }

export const useGetBusinessContacts = (businessId: string) => {
  return useQuery({
    queryKey: ["businessContacts", businessId],
    queryFn: () => getBusinessContacts(businessId),
    enabled: !!businessId,
  })
}

export const useUpdateBusinessContacts = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: ({
        contactId,
        data,
      }: {
        contactId: string
        data: {
          contactName: string
          contactValue: string
        }
      }) => updateBusinessContacts(contactId, data),
      onSuccess: (_data, _variables) => {
        queryClient.invalidateQueries({ queryKey: ["businessContacts"] })
      },
    })
  }
  

export const useDeleteBusinessContact = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: deleteBusinessContact,
      onSuccess: (_data, contactId) => {
        queryClient.invalidateQueries({ queryKey: ["businessContacts"] }) // opsiyonel: spesifik businessId varsa kullan
      },
    })
  }
