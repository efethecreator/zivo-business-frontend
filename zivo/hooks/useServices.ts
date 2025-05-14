// hooks/useServices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, createService, updateService, deleteService, assignWorkersToService, getServiceWorkers, removeWorkerFromService } from "@/lib/services.service";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  businessId: string;
}

interface CreateServiceDto {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  businessId: string;
}

interface UpdateServiceDto extends CreateServiceDto {}

export const useGetServices = (businessId: string) => {
  return useQuery<Service[]>({
    queryKey: ["services", businessId],
    queryFn: () => getServices(businessId),
    enabled: !!businessId,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceDto) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

// Servislere çalışan ata
export const useAssignWorkersToService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { serviceId: string; workerIds: string[] }) =>
      assignWorkersToService(data.serviceId, data.workerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

// Servise atanmış çalışanları getir
export const useGetServiceWorkers = (serviceId: string) => {
  return useQuery({
    queryKey: ["serviceWorkers", serviceId],
    queryFn: () => getServiceWorkers(serviceId),
    enabled: !!serviceId,
  });
};

// Servisten çalışan sil
export const useRemoveWorkerFromService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { serviceId: string; workerId: string }) =>
      removeWorkerFromService(data.serviceId, data.workerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceWorkers"] });
    },
  });
};
