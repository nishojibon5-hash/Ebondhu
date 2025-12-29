// User Management API Service with Retry Logic and Fallback

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
  fromCache?: boolean;
}

export interface RegisterResponse {
  ok: boolean;
  message?: string;
  user?: User;
  error?: string;
  synced?: boolean;
}

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 500,
  maxDelay: 3000,
  backoffMultiplier: 2,
};

// Exponential backoff retry function
async function retryRequest<T>(
  fn: () => Promise<T>,
  maxAttempts: number = RETRY_CONFIG.maxAttempts,
): Promise<T> {
  let lastError: Error | null = null;
  let delay = RETRY_CONFIG.initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay);
      }
    }
  }

  throw lastError;
}

// Fallback: Check localStorage for registered users
function getRegisteredUsersFromStorage(): User[] {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
}

// Fallback: Save user to localStorage
function saveUserToStorage(user: User): void {
  try {
    const users = getRegisteredUsersFromStorage();
    const index = users.findIndex((u) => u.phone === user.phone);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
}

// Fallback: Get user from localStorage
function getUserFromStorage(phone: string): User | null {
  try {
    const users = getRegisteredUsersFromStorage();
    return users.find((u) => u.phone === phone) || null;
  } catch {
    return null;
  }
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user: User = {
    id: userId,
    phone: data.phone,
    name: data.name,
    balance: 0,
  };

  try {
    // Try to register on the server
    const response = await retryRequest(async () => {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }

      return res.json();
    });

    // Save to localStorage as backup
    saveUserToStorage(user);

    return {
      ok: true,
      message: response.message || "User registered successfully",
      user,
      synced: true,
    };
  } catch (error) {
    console.error("Server registration failed, using localStorage fallback:", error);

    // Check if user already exists in localStorage
    const existingUser = getUserFromStorage(data.phone);
    if (existingUser) {
      return {
        ok: false,
        error: "User already registered",
      };
    }

    // Fallback: Save to localStorage
    saveUserToStorage(user);

    return {
      ok: true,
      message: "User registered (will sync to cloud when online)",
      user,
      synced: false,
    };
  }
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    // Try server first
    const response = await retryRequest(async () => {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      return res.json();
    });

    return {
      ok: true,
      user: response.user,
      fromCache: false,
    };
  } catch (error) {
    console.error("Server login failed, checking localStorage:", error);

    // Fallback: Check localStorage
    const user = getUserFromStorage(data.phone);

    if (!user) {
      return {
        ok: false,
        error: "User not found",
      };
    }

    // In a real app, you'd need to store the PIN hash, not plaintext
    // For now, we're checking against the credential in storage
    const storedPin = localStorage.getItem(`pin_${data.phone}`);
    if (!storedPin || storedPin !== data.pin) {
      return {
        ok: false,
        error: "Invalid credentials",
      };
    }

    return {
      ok: true,
      user,
      fromCache: true,
    };
  }
}

export async function getUser(phone: string): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const response = await retryRequest(async () => {
      const res = await fetch(`/api/users/${phone}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to get user");
      }

      return res.json();
    });

    return { ok: true, user: response.user };
  } catch (error) {
    console.error("Error getting user:", error);

    // Fallback to localStorage
    const user = getUserFromStorage(phone);
    if (user) {
      return { ok: true, user };
    }

    return { ok: false, error: "User not found" };
  }
}

export async function updateUserBalance(
  phone: string,
  amount: number,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const response = await retryRequest(async () => {
      const res = await fetch("/api/users/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });

      if (!res.ok) {
        throw new Error("Failed to update balance");
      }

      return res.json();
    });

    return { ok: true, user: response.user };
  } catch (error) {
    console.error("Error updating balance:", error);
    return { ok: false, error: "Failed to update balance" };
  }
}

export async function getAllUsers(): Promise<{
  ok: boolean;
  users?: User[];
  error?: string;
}> {
  try {
    const response = await retryRequest(async () => {
      const res = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to get users");
      }

      return res.json();
    });

    return { ok: true, users: response.users };
  } catch (error) {
    console.error("Error getting users:", error);

    // Fallback to localStorage
    const users = getRegisteredUsersFromStorage();
    if (users.length > 0) {
      return { ok: true, users };
    }

    return { ok: false, error: "Failed to get users" };
  }
}

// Admin function: Delete user (requires admin token)
export async function deleteUser(
  phone: string,
  adminToken: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await retryRequest(async () => {
      const res = await fetch(`/api/admin/users/${phone}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Delete failed");
      }

      return res.json();
    });

    return { ok: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { ok: false, error: String(error) };
  }
}
