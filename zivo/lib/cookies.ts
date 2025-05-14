import Cookies from "js-cookie";

// Cookie options
const cookieOptions = {
  expires: 1, // 1 day
  path: "/",
  secure: process.env.NODE_ENV === "production", // Only use secure in production
  sameSite: "strict" as const,
};

// Set a cookie
export function setCookie(name: string, value: string) {
  return Cookies.set(name, value, cookieOptions);
}

// Get a cookie
export function getCookie(name: string) {
  return Cookies.get(name);
}

// Remove a cookie
export function removeCookie(name: string) {
  return Cookies.remove(name, { path: "/" });
}
