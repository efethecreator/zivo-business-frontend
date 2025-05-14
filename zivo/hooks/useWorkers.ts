// src/hooks/useWorkers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";

// 🔹 İşletmeye ait çalışanları getir
export const useGetWorkers = (businessId?: string) => {
  return useQuery({
    queryKey: ["workers", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const response = await api.get(
        `v1/business-workers/business/${businessId}`
      );
      return response.data;
    },
    enabled: !!businessId, // businessId varsa aktif olsun
  });
};

// 🔹 Yeni çalışan ekle
export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newWorker: any) => {
      const response = await api.post("v1/business-workers", newWorker);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};

// 🔹 Çalışan güncelle
export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`v1/business-workers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};

// 🔹 Çalışan sil (soft delete)
export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`v1/business-workers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
};

// 🔹 Worker türlerini (kategori) getir
export const useGetWorkerTypes = () => {
  return useQuery({
    queryKey: ["worker-types"],
    queryFn: async () => {
      const response = await api.get("v1/worker-types");
      return response.data;
    },
  });
};
