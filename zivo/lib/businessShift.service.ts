import api from "@/utils/api";

interface CreateBusinessShiftInput {
  businessId: string;
  dayOfWeek: number;
  shiftTimeId: string;
}

interface CreateBusinessShiftResponse {
  id: string;
  businessId: string;
  dayOfWeek: string;
  shiftTimeId: string;
}

export async function createBusinessShift(data: CreateBusinessShiftInput): Promise<CreateBusinessShiftResponse> {
  const response = await api.post<CreateBusinessShiftResponse>("v1/business-shifts", data);
  return response.data;
}

export const getBusinessShifts = async (businessId: string) => {
  const response = await api.get(`/v1/business-shifts/business/${businessId}`);
  return response.data;
};

// ✅ isActive alanı eklendi
export const updateBusinessShift = async (
  id: string,
  data: {
    dayOfWeek: number;
    shiftTimeId: string;
    businessId: string;
    isActive: boolean;
  }
) => {
  const response = await api.put(`/v1/business-shifts/${id}`, data);
  return response.data;
};

export const deleteBusinessShift = async (id: string) => {
  const response = await api.delete(`/v1/business-shifts/${id}`);
  return response.data;
};
