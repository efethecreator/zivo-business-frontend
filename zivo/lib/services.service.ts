// lib/service.ts
import api from "@/utils/api";

// Service Tipi (Backend uyumlu)
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  businessId: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  businessId: string;
}

export interface UpdateServiceInput {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
}

// Yeni tipler (Backend uyumlu)
export interface ServiceWorker {
  id: string;
  workerId: string;
  serviceId: string;
}

export interface AssignWorkersToServiceInput {
  workerIds: string[]; // Çalışan ID'leri
}

// Hizmetleri çek
export const getServices = async (businessId: string) => {
  const response = await api.get<Service[]>(
    `v1/services/business/${businessId}`
  );
  return response.data;
};

// Yeni hizmet oluştur
export const createService = async (data: CreateServiceInput) => {
  const response = await api.post<Service>("v1/services", data);
  return response.data;
};

// Hizmeti güncelle
export const updateService = async (id: string, data: UpdateServiceInput) => {
  const response = await api.put<Service>(`v1/services/${id}`, data);
  return response.data;
};

// Hizmeti sil (soft delete)
export const deleteService = async (id: string) => {
  const response = await api.delete(`v1/services/${id}`);
  return response.data;
};

// Çalışanları servise ata
export const assignWorkersToService = async (
  serviceId: string,
  workerIds: string[]
) => {
  const response = await api.put(`/v1/services/${serviceId}/workers`, {
    workerIds,
  });
  return response.data;
};

// Servise atanmış çalışanları getir
export const getServiceWorkers = async (serviceId: string) => {
  const response = await api.get<ServiceWorker[]>(
    `/v1/services/${serviceId}/workers`
  );
  return response.data;
};

// Servisten çalışan sil
export const removeWorkerFromService = async (
  serviceId: string,
  workerId: string
) => {
  const response = await api.delete(
    `/v1/services/${serviceId}/workers/${workerId}`
  );
  return response.data;
};
