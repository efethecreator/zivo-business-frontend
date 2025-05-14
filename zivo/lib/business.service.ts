import api from "@/utils/api";

interface CreateBusinessData {
  name: string;
  businessTypeId: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  profileImage: File | null;
  coverImage: File | null;
  description: string;
  phone: string;
}

interface CreateBusinessResponse {
  id: string;
  name: string;
  businessTypeId: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  profileImage: File | null;
  coverImage: File | null;
  description: string;
  phone: string;
}

export async function createBusiness(
  data: CreateBusinessData
): Promise<CreateBusinessResponse> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("businessTypeId", data.businessTypeId);
  formData.append("address", data.address);
  formData.append("latitude", data.latitude.toString());
  formData.append("longitude", data.longitude.toString());
  formData.append("description", data.description); // ➡️ EKLENDİ
  formData.append("phone", data.phone);
  formData.append("city", data.city);
  formData.append("district", data.district);
  formData.append("postalCode", data.postalCode || ""); // Optional field

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  const response = await api.post<CreateBusinessResponse>(
    "v1/business",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export const getBusiness = async (businessId: string) => {
  const response = await api.get(`/v1/business/${businessId}`);
  return response.data;
};

export const updateBusiness = async (
  businessId: string,
  data: {
    name?: string;
    description?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    profileImageUrl?: string;
    coverImageUrl?: string;
  }
) => {
  const response = await api.put(`/v1/business/${businessId}`, data);
  return response.data;
};
