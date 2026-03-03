// Ads API Service

export interface Advertisement {
  id: string;
  advertiserPhone: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  dailyBudget?: string;
  pricePerMille?: string;
  status: string;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MonetizeSettings {
  userPhone: string;
  contentMonetizeEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Create Advertisement
export async function createAd(
  advertiserPhone: string,
  title: string,
  description: string,
  image: string,
  category?: string,
  dailyBudget?: string,
  pricePerMille?: string,
): Promise<{ ok: boolean; ad?: Advertisement; error?: string }> {
  try {
    const response = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advertiserPhone,
        title,
        description,
        image,
        category,
        dailyBudget,
        pricePerMille,
      }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", response.status, text.substring(0, 200));
      return {
        ok: false,
        error: `সার্ভার ত্রুটি (${response.status})`,
      };
    }

    if (!response.ok) {
      console.error("Create ad response error:", response.status, data);
      return { ok: false, error: data.error || `বিজ্ঞাপন তৈরি ব্যর্থ: ${response.status}` };
    }

    return data;
  } catch (error) {
    console.error("Create ad error:", error);
    const errorMsg = error instanceof Error ? error.message : "নেটওয়ার্ক সংযোগ ত্রুটি";
    return { ok: false, error: errorMsg };
  }
}

// Get Advertiser's Ads
export async function getAdvertiserAds(
  advertiserPhone: string,
): Promise<{ ok: boolean; ads?: Advertisement[]; error?: string }> {
  try {
    const response = await fetch(`/api/ads/advertiser/${advertiserPhone}`);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "বিজ্ঞাপন আনতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Get advertiser ads error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Get Feed Ads
export async function getFeedAds(userPhone?: string): Promise<{
  ok: boolean;
  ads?: Advertisement[];
  error?: string;
}> {
  try {
    const query = userPhone ? `?userPhone=${userPhone}` : "";
    const response = await fetch(`/api/ads/feed${query}`);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "বিজ্ঞাপন আনতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Get feed ads error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Log Ad Impression
export async function logAdImpression(
  adId: string,
  userPhone: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, userPhone }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "ইম্প্রেশন রেকর্ড করতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Log ad impression error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Log Ad Click
export async function logAdClick(
  adId: string,
  userPhone: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/ads/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, userPhone }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "ক্লিক রেকর্ড করতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Log ad click error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Update Ad Status
export async function updateAdStatus(
  adId: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/ads/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, status }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "বিজ্ঞাপন আপডেট করতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Update ad status error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Update Monetize Settings
export async function updateMonetizeSettings(
  userPhone: string,
  contentMonetizeEnabled: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/ads/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPhone, contentMonetizeEnabled }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "সেটিংস আপডেট করতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Update monetize settings error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}

// Get Monetize Settings
export async function getMonetizeSettings(
  userPhone: string,
): Promise<{ ok: boolean; settings?: MonetizeSettings; error?: string }> {
  try {
    const response = await fetch(`/api/ads/settings/${userPhone}`);

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return { ok: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "সেটিংস আনতে ব্যর্থ" };
    }

    return data;
  } catch (error) {
    console.error("Get monetize settings error:", error);
    return { ok: false, error: "নেটওয়ার্ক সংযোগ ত্রুটি" };
  }
}
