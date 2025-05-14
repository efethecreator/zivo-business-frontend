import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShiftTime } from "@/lib/shiftTime.service";

export const useDeleteShiftTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteShiftTime(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-times"] });
    },
  });
};

