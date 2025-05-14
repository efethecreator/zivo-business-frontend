// lib/uploadService.ts
import api from "@/utils/api";

const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/v1/upload/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; // örn. https://s3.amazonaws.com/zivo/uploads/...
};

export default uploadProfileImage;
