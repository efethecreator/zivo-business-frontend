"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../lib/auth.service";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: () => {
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz! Yönlendiriliyorsunuz...",
      });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Hata",
        description: error?.message || "Giriş işlemi sırasında hata oluştu",
      });
    },
  });
}
