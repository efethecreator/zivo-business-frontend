import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessShift } from "@/lib/businessShift.service";

export const useDeleteBusinessShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteBusinessShift(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["business-shifts"] });
    },
  });
};
