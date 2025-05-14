import api from "@/utils/api";

// Dashboard Summary
export const getDashboardSummary = async (businessId: string) => {
  const response = await api.get(`v1/dashboard/summary/${businessId}`);
  return response.data;
};

// Business Appointments
export const getBusinessAppointments = async (businessId: string) => {
  const response = await api.get(`v1/appointments/business/${businessId}`);
  return response.data;
};

// Business Reviews
export const getBusinessReviews = async (businessId: string) => {
  const response = await api.get(`v1/reviews/business/${businessId}`);
  return response.data;
};
