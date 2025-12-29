// Local storage helper for user session data

export interface UserSession {
  isLoggedIn: boolean;
  userPhone: string;
  userName: string;
  userBalance: number;
  userPin?: string;
}

const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_PHONE: "userPhone",
  USER_NAME: "userName",
  USER_BALANCE: "userBalance",
  USER_PIN: "userPin",
  REGISTERED_USERS: "registeredUsers",
  FEATURE_FLAGS: "featureFlags",
  BANNERS: "banners",
  REFERRAL_DATA: "referralData",
  MANUAL_TOPUP_REQUESTS: "manualTopupRequests",
  CASHOUT_REQUESTS: "cashoutRequests",
  PAYOUT_WALLET_CONFIG: "payoutWalletConfig",
  ADMIN_WALLET_BALANCE: "adminWalletBalance",
};

// User Session Management
export function setUserSession(session: Partial<UserSession>) {
  if (session.isLoggedIn !== undefined) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(session.isLoggedIn));
  }
  if (session.userPhone !== undefined) {
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, session.userPhone);
  }
  if (session.userName !== undefined) {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, session.userName);
  }
  if (session.userBalance !== undefined) {
    localStorage.setItem(
      STORAGE_KEYS.USER_BALANCE,
      String(session.userBalance),
    );
  }
  if (session.userPin !== undefined) {
    localStorage.setItem(STORAGE_KEYS.USER_PIN, session.userPin);
  }
}

export function getUserSession(): UserSession {
  return {
    isLoggedIn: localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
    userPhone: localStorage.getItem(STORAGE_KEYS.USER_PHONE) || "",
    userName: localStorage.getItem(STORAGE_KEYS.USER_NAME) || "",
    userBalance: parseFloat(
      localStorage.getItem(STORAGE_KEYS.USER_BALANCE) || "0",
    ),
    userPin: localStorage.getItem(STORAGE_KEYS.USER_PIN) || "",
  };
}

export function clearUserSession() {
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_BALANCE);
  localStorage.removeItem(STORAGE_KEYS.USER_PIN);
}

// Feature Flags
export function getFeatureFlags(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEATURE_FLAGS) || "{}");
  } catch {
    return {};
  }
}

export function setFeatureFlags(flags: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEYS.FEATURE_FLAGS, JSON.stringify(flags));
}

// Banners
export function getBanners(): any[] {
  try {
    const banners = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return Array.isArray(banners) ? banners : JSON.parse(banners || "[]");
  } catch {
    return [];
  }
}

export function setBanners(banners: any[]) {
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
}

// Requests (Topup, Cashout, etc.)
export function getManualTopupRequests(): any[] {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MANUAL_TOPUP_REQUESTS) || "[]",
    );
  } catch {
    return [];
  }
}

export function setManualTopupRequests(requests: any[]) {
  localStorage.setItem(
    STORAGE_KEYS.MANUAL_TOPUP_REQUESTS,
    JSON.stringify(requests),
  );
}

export function getCashoutRequests(): any[] {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CASHOUT_REQUESTS) || "[]",
    );
  } catch {
    return [];
  }
}

export function setCashoutRequests(requests: any[]) {
  localStorage.setItem(STORAGE_KEYS.CASHOUT_REQUESTS, JSON.stringify(requests));
}

// Payout Wallet Config
export function getPayoutWalletConfig(): Record<string, any> {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PAYOUT_WALLET_CONFIG) || "{}",
    );
  } catch {
    return {};
  }
}

export function setPayoutWalletConfig(config: Record<string, any>) {
  localStorage.setItem(
    STORAGE_KEYS.PAYOUT_WALLET_CONFIG,
    JSON.stringify(config),
  );
}

// Admin Wallet Balance
export function getAdminWalletBalance(): number {
  return parseFloat(
    localStorage.getItem(STORAGE_KEYS.ADMIN_WALLET_BALANCE) || "0",
  );
}

export function setAdminWalletBalance(balance: number) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_WALLET_BALANCE, String(balance));
}

// Registered Users (for migration from localStorage to server)
export function getRegisteredUsers(): any[] {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS) || "[]",
    );
  } catch {
    return [];
  }
}

export function setRegisteredUsers(users: any[]) {
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
}

// Referral Data
export function getReferralData(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REFERRAL_DATA) || "{}");
  } catch {
    return {};
  }
}

export function setReferralData(data: Record<string, any>) {
  localStorage.setItem(STORAGE_KEYS.REFERRAL_DATA, JSON.stringify(data));
}

// Clear all user data
export function clearAllUserData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
