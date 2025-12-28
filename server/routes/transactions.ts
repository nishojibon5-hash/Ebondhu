import { RequestHandler } from "express";
import {
  appendRow,
  findRows,
  getRows,
  updateRow,
  SHEET_NAMES,
} from "../services/sheets";
import crypto from "crypto";

export const handleAddTransaction: RequestHandler = async (req, res) => {
  try {
    const { phone, type, amount, description } = req.body;

    if (!phone || !type || !amount) {
      return res.status(400).json({
        ok: false,
        error: "Phone, type, and amount are required",
      });
    }

    const transactionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const transactionData = [
      transactionId,
      phone,
      type,
      amount.toString(),
      description || "",
      now,
      "completed",
    ];

    await appendRow(SHEET_NAMES.TRANSACTIONS, transactionData);

    res.status(201).json({
      ok: true,
      transaction: {
        id: transactionId,
        phone,
        type,
        amount,
        description,
        timestamp: now,
        status: "completed",
      },
    });
  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetUserTransactions: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        ok: false,
        error: "Phone number is required",
      });
    }

    const transactions = await findRows(
      SHEET_NAMES.TRANSACTIONS,
      "phone",
      phone,
    );

    res.json({
      ok: true,
      transactions: transactions
        .reverse()
        .map((t) => ({
          id: t.id,
          phone: t.phone,
          type: t.type,
          amount: parseFloat(t.amount || "0"),
          description: t.description || "",
          timestamp: t.timestamp,
          status: t.status || "completed",
        })),
    });
  } catch (error) {
    console.error("Get user transactions error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetAllTransactions: RequestHandler = async (req, res) => {
  try {
    const transactions = await getRows(SHEET_NAMES.TRANSACTIONS);

    res.json({
      ok: true,
      transactions: transactions
        .reverse()
        .map((t) => ({
          id: t.id,
          phone: t.phone,
          type: t.type,
          amount: parseFloat(t.amount || "0"),
          description: t.description || "",
          timestamp: t.timestamp,
          status: t.status || "completed",
        })),
    });
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateTransactionStatus: RequestHandler = async (
  req,
  res,
) => {
  try {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({
        ok: false,
        error: "Transaction ID and status are required",
      });
    }

    const rows = await getRows(SHEET_NAMES.TRANSACTIONS);
    const index = rows.findIndex((row) => row.id === transactionId);

    if (index === -1) {
      return res.status(404).json({
        ok: false,
        error: "Transaction not found",
      });
    }

    const transaction = rows[index];
    const updatedValues = [
      transaction.id,
      transaction.phone,
      transaction.type,
      transaction.amount,
      transaction.description,
      transaction.timestamp,
      status,
    ];

    await updateRow(SHEET_NAMES.TRANSACTIONS, index, updatedValues);

    res.json({
      ok: true,
      message: "Transaction status updated",
    });
  } catch (error) {
    console.error("Update transaction status error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
