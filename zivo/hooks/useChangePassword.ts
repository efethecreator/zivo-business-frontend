import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/auth.service";
import { useToast } from "@/hooks/use-toast";

export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (message) => {
      toast({
        title: "Başarılı",
        description: message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error?.response?.data?.message || "Şifre güncellenemedi.",
        variant: "destructive",
      });
    },
  });
};
