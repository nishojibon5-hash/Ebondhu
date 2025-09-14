import { AdminLoginResponse, AdminVerifyResponse } from "@shared/api";

const TOKEN_KEY = "adminToken";
const ADMIN_FLAG = "isAdmin";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminSession(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_FLAG, "true");
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_FLAG);
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_FLAG) === "true" && !!getAdminToken();
}

export async function verifyAdmin(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = (await res.json()) as AdminVerifyResponse;
    return !!data.ok && data.role === "admin";
  } catch {
    return false;
  }
}

export async function loginAdmin(
  password: string,
): Promise<AdminLoginResponse> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json()) as AdminLoginResponse;
    if (data.ok && data.token) setAdminSession(data.token);
    return data;
  } catch {
    return {
      ok: false,
      error:
        "সার্ভার API পাওয়া যায়নি। Netlify ডিপ্লয়মেন্টে /api সক্রিয় করুন বা সার্ভারের environment variables সেট করুন।",
    };
  }
}
