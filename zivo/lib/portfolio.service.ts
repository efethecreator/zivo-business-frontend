// src/services/portfolio.service.ts
import api from "@/utils/api";

// 🧩 Portfolio item tipi
interface PortfolioItem {
  id: string;
  businessId: string;
  imageUrl: string;
  description: string;
  uploadedAt: string;
}

// 🔹 Portfolyoları getir
export const getPortfolios = async (businessId: string): Promise<PortfolioItem[]> => {
  const res = await api.get(`v1/portfolios/business/${businessId}`);
  return res.data;
};

// 🔹 Yeni portfolio oluştur
export const createPortfolio = async (formData: FormData) => {
  const res = await api.post("v1/portfolios", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 Portfolio güncelle (sadece açıklama)
export const updatePortfolio = async (id: string, data: { description: string }) => {
  const res = await api.put(`v1/portfolios/${id}`, data);
  return res.data;
};

// 🔹 Portfolio sil (soft delete)
export const deletePortfolio = async (id: string) => {
  const res = await api.delete(`v1/portfolios/${id}`);
  return res.data;
};
