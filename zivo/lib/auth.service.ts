import api from "@/utils/api";
// Import the cookie utilities at the top of the file
import { setCookie, removeCookie } from "./cookies";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    profileId: string;
    role: string;
  };
}

interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  userType: "store_owner" | "customer";
  isLawApproved: boolean;
}

interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  profileId: string;
  role: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  currentPasswordTekrar: string;
  newPassword: string;
}

export async function loginUser({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("v1/auth/login", {
    email,
    password,
  });

  // Başarılı olursa token'ı localStorage'a kaydedelim
  // In the loginUser function, replace the localStorage code with:
  // Replace this:
  // if (typeof window !== "undefined" && response.data.token) {
  //   localStorage.setItem("token", response.data.token)
  // }

  // With this:
  if (response.data.token) {
    setCookie("token", response.data.token);
  }

  return response.data;
}

export async function registerUser(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "v1/auth/register",
    credentials
  );
  return response.data;
}

// Kullanıcı bilgisini al
export const getUserProfile = async () => {
  const response = await api.get("v1/auth/me");
  const user = response.data;

  if (user.userType === "store_owner" && user.businessId) {
    const businessRes = await api.get(`/v1/business/${user.businessId}`);
    return {
      ...user,
      business: businessRes.data, // ⬅️ business objesi eklendi
    };
  }

  return user;
};

export const updateMe = async (data: { fullName: string; email: string }) => {
  const response = await api.put("/v1/users/me", data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordPayload
): Promise<string> => {
  const res = await api.put("/v1/auth/change-password", data);
  return res.data.message; // "Şifre başarıyla güncellendi"
};

// In the logoutUser function, replace the localStorage code with:
// Replace this:
// export const logoutUser = async () => {
//   // Şu anda backend logout olmadığı için sadece token temizle
//   localStorage.removeItem("token")
//   localStorage.removeItem("user")
// }

// With this:
export const logoutUser = async () => {
  // Şu anda backend logout olmadığı için sadece token temizle
  removeCookie("token");
  removeCookie("user");
};
