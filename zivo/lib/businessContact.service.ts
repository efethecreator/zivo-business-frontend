import api from "@/utils/api";

export interface BusinessContactPayload {
  contactName: string;
  contactValue: string;
}

export const createBusinessContact = async (contact: {
  businessId: string;
  contactName: string;
  contactValue: string;
}) => {
  const response = await api.post("/v1/business-contacts", contact);
  return response.data;
};

export const getBusinessContacts = async (businessId: string) => {
  const response = await api.get(
    `/v1/business-contacts/business/${businessId}`
  );
  return response.data;
};

export const updateBusinessContacts = async (
  contactId: string,
  data: {
    contactName: string;
    contactValue: string;
  }
) => {
  const response = await api.put(`/v1/business-contacts/${contactId}`, data);
  return response.data;
};

export const deleteBusinessContact = async (contactId: string) => {
  const response = await api.delete(`/v1/business-contacts/${contactId}`);
  return response.data;
};
