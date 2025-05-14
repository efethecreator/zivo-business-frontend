import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessShift } from "@/lib/businessShift.service";

export const useUpdateBusinessShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        dayOfWeek: number;
        shiftTimeId: string;
        businessId: string;
        isActive: boolean; // ✅ burada da ekli
      };
    }) => {
      return updateBusinessShift(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["business-shifts", variables.data.businessId],
      });
    },
  });
};
