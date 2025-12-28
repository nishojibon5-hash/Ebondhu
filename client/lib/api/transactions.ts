// Transaction Management API Service

export interface Transaction {
  id: string;
  phone: string;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

export interface AddTransactionRequest {
  phone: string;
  type: string;
  amount: number;
  description?: string;
}

export interface TransactionResponse {
  ok: boolean;
  transaction?: Transaction;
  error?: string;
}

export interface TransactionsListResponse {
  ok: boolean;
  transactions?: Transaction[];
  error?: string;
}

export async function addTransaction(
  data: AddTransactionRequest,
): Promise<TransactionResponse> {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Add transaction error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getUserTransactions(
  phone: string,
): Promise<TransactionsListResponse> {
  try {
    const response = await fetch(`/api/transactions/${phone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get user transactions error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function getAllTransactions(): Promise<TransactionsListResponse> {
  try {
    const response = await fetch("/api/transactions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Get all transactions error:", error);
    return { ok: false, error: "Network error" };
  }
}

export async function updateTransactionStatus(
  transactionId: string,
  status: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch("/api/transactions/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Update transaction status error:", error);
    return { ok: false, error: "Network error" };
  }
}
