import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getBusiness, updateBusiness } from "@/lib/business.service";

export const useGetBusiness = (businessId: string) => {
    return useQuery({
      queryKey: ["business", businessId],
      queryFn: () => getBusiness(businessId),
      enabled: !!businessId,
    })
  }

export const useUpdateBusiness = () => {
  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: {
        name?: string;
        description?: string;
        phone?: string;
        address?: string;
        city?: string;
        district?: string;
        postalCode?: string;
        website?: string;
        latitude?: number;
        longitude?: number;
        profileImageUrl?: string;
        coverImageUrl?: string;
      };
    }) => updateBusiness(businessId, data),
  });
};
