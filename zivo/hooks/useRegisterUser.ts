import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../lib/auth.service";
import { useToast } from "@/hooks/use-toast";

interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  userType: "store_owner" | "customer";
  isLawApproved: boolean;
}

export function useRegisterUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
    onError: (error: any) => {
      console.error("Register error:", error);
      toast({
        title: "Kayıt Başarısız",
        description: error?.message || "Kayıt işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
}
