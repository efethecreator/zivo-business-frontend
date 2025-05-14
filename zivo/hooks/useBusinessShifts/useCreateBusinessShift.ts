import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessShift } from "@/lib/businessShift.service";

export function useCreateBusinessShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-shifts"] });
    },
  });
}
