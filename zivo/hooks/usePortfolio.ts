// src/hooks/usePortfolio.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "@/lib/portfolio.service";

// 🧩 Portfolio item tipi (tekrar tanımlıyoruz çünkü ayrı dosyadayız)
interface PortfolioItem {
  id: string;
  businessId: string;
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

// 🔹 Portfolyoları çekme hook'u
export const useGetPortfolios = (businessId: string) =>
  useQuery<PortfolioItem[]>({
    queryKey: ["portfolios", businessId],
    queryFn: () => getPortfolios(businessId),
    enabled: !!businessId, // businessId varsa çalışır
  });

// 🔹 Yeni portfolio oluşturma hook'u
export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
};

// 🔹 Portfolio güncelleme hook'u
export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { description: string } }) =>
      updatePortfolio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
};

// 🔹 Portfolio silme hook'u
export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
};
