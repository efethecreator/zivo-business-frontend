import { useQuery } from "@tanstack/react-query";
import { getShiftTimes } from "@/lib/shiftTime.service";

export const useGetShiftTimes = () => {
  return useQuery({
    queryKey: ["shift-times"],
    queryFn: getShiftTimes,
  });
};
