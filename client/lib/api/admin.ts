// Admin Data Management API Service

export interface Banner {
  id: string;
  image: string;
  link?: string;
  createdAt: string;
}

export interface Request {
  id: string;
  phone: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface FeatureFlagsResponse {
  ok: boolean;
  flags?: Record<string, boolean | string | number>;
  error?: string;
}

export interface BannersResponse {
  ok: boolean;
  banners?: Banner[];
  error?: string;
}

export interface RequestsResponse {
  ok: boolean;
  requests?: Request[];
  error?: string;
}

export interface PayoutWalletsResponse {
  ok: boolean;
  wallets?: Record<string, { enabled: boolean; reserve: number }>;
  error?: string;
}

// Feature Flags
export async function getFeatureFlags(): Promise<FeatureFlagsResponse> {
  try {
    const response = await fetch("/api/admin/feature-flags", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get feature flags error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updateFeatureFlags(flags: Record<string, boolean | string | number>): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flags }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update feature flags error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Banners
export async function getBanners(): Promise<BannersResponse> {
  try {
    const response = await fetch("/api/admin/banners", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get banners error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function addBanner(image: string, link?: string): Promise<{ ok: boolean; banner?: Banner; error?: string }> {
  try {
    const response = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, link }),
    });
    return await response.json();
  } catch (error) {
    console.error("Add banner error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function deleteBanner(bannerId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Delete banner error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Payout Wallets
export async function getPayoutWallets(): Promise<PayoutWalletsResponse> {
  try {
    const response = await fetch("/api/admin/payout-wallets", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get payout wallets error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updatePayoutWallets(
  wallets: Record<string, { enabled: boolean; reserve: number }>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/payout-wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallets }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update payout wallets error:", error);
    return { ok: false, error: "Network error" };
  }
}

// Requests (topups, cashouts, etc.)
export async function getRequests(
  type?: string,
  status?: string,
): Promise<RequestsResponse> {
  try {
    const query = new URLSearchParams();
    if (type) query.append("type", type);
    if (status) query.append("status", status);

    const response = await fetch(`/api/admin/requests?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get requests error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function addRequest(
  phone: string,
  type: string,
  amount: number,
): Promise<{ ok: boolean; request?: Request; error?: string }> {
  try {
    const response = await fetch("/api/admin/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, type, amount }),
    });
    return await response.json();
  } catch (error) {
    console.error("Add request error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updateRequestStatus(
  requestId: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/admin/requests/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update request status error:", error);
    return { ok: false, error: "Network error" };
  }
}
