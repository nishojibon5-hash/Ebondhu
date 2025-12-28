// User Management API Service

export interface User {
  id: string;
  phone: string;
  name: string;
  balance: number;
}

export interface LoginRequest {
  phone: string;
  pin: string;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  pin: string;
}

export interface LoginResponse {
  ok: boolean;
  user?: User;
  error?: string;
}

export interface RegisterResponse {
  ok: boolean;
  message?: string;
  user?: User;
  error?: string;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getUser(phone: string): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`/api/users/${phone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get user error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updateUserBalance(
  phone: string,
  amount: number,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/users/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update balance error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getAllUsers(): Promise<{
  ok: boolean;
  users?: User[];
  error?: string;
}> {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get all users error:", error);
    return { ok: false, error: "Network error" };
  }
}
