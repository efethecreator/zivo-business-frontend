import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShiftTime } from "@/lib/shiftTime.service";

export const useUpdateShiftTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { startTime: string; endTime: string };
    }) => {
      return updateShiftTime(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(); // İstersen sadece shift-times cache'ini de invalid edebilirsin
    },
  });
};
