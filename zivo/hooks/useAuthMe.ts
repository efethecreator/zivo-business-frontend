import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

export const useAuthMe = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await api.get("v1/auth/me");
      const user = response.data;

      // Eğer işletme hesabıysa business bilgilerini getir
      if (user.userType === "store_owner" && user.businessId) {
        const businessRes = await api.get(`/v1/business/${user.businessId}`);
        return { ...user, business: businessRes.data }; // business'i user objesine ekle
      }

      return user;
    },
  });
};
