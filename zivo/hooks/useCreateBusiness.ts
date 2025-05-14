import { useMutation } from "@tanstack/react-query";
import { createBusiness } from "@/lib/business.service";

export function useCreateBusiness() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      businessTypeId: string;
      address: string;
      city: string;
      district: string;
      postalCode: string;
      latitude: number;
      longitude: number;
      profileImage: File | null;
      coverImage: File | null;
      description: string;
      phone: string;
    }) => {
      return createBusiness(data);
    },
  });
}
