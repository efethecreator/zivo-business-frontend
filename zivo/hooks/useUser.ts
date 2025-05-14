import { useMutation } from "@tanstack/react-query";
import { updateMe } from "@/lib/auth.service";

export const useUpdateMe = () => {
  return useMutation({
    mutationFn: (data: { fullName: string; email: string }) => updateMe(data),
  });
};
