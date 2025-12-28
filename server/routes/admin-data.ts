import { RequestHandler } from "express";
import {
  appendRow,
  getRows,
  updateRow,
  SHEET_NAMES,
  deleteRow,
  findRow,
} from "../services/sheets";
import crypto from "crypto";

// Feature Flags Management
export const handleGetFeatureFlags: RequestHandler = async (req, res) => {
  try {
    const rows = await getRows(SHEET_NAMES.FEATURE_FLAGS);

    const flags: Record<string, boolean | number> = {};
    rows.forEach((row) => {
      if (row.key) {
        flags[row.key] = row.value === "true" ? true : row.value === "false" ? false : row.value;
      }
    });

    res.json({
      ok: true,
      flags,
    });
  } catch (error) {
    console.error("Get feature flags error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateFeatureFlags: RequestHandler = async (req, res) => {
  try {
    const { flags } = req.body;

    if (!flags || typeof flags !== "object") {
      return res.status(400).json({
        ok: false,
        error: "Flags object is required",
      });
    }

    const rows = await getRows(SHEET_NAMES.FEATURE_FLAGS);

    for (const [key, value] of Object.entries(flags)) {
      const index = rows.findIndex((row) => row.key === key);
      const now = new Date().toISOString();
      const values = [key, value.toString(), now];

      if (index !== -1) {
        await updateRow(SHEET_NAMES.FEATURE_FLAGS, index, values);
      } else {
        await appendRow(SHEET_NAMES.FEATURE_FLAGS, values);
      }
    }

    res.json({
      ok: true,
      message: "Feature flags updated successfully",
    });
  } catch (error) {
    console.error("Update feature flags error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// Banners Management
export const handleGetBanners: RequestHandler = async (req, res) => {
  try {
    const rows = await getRows(SHEET_NAMES.BANNERS);

    res.json({
      ok: true,
      banners: rows.map((row) => ({
        id: row.id,
        image: row.image,
        link: row.link || undefined,
        createdAt: row.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get banners error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleAddBanner: RequestHandler = async (req, res) => {
  try {
    const { image, link } = req.body;

    if (!image) {
      return res.status(400).json({
        ok: false,
        error: "Image is required",
      });
    }

    const bannerId = crypto.randomUUID();
    const now = new Date().toISOString();

    const bannerData = [bannerId, image, link || "", now];

    await appendRow(SHEET_NAMES.BANNERS, bannerData);

    res.status(201).json({
      ok: true,
      banner: {
        id: bannerId,
        image,
        link,
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Add banner error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleDeleteBanner: RequestHandler = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        ok: false,
        error: "Banner ID is required",
      });
    }

    const rows = await getRows(SHEET_NAMES.BANNERS);
    const index = rows.findIndex((row) => row.id === bannerId);

    if (index === -1) {
      return res.status(404).json({
        ok: false,
        error: "Banner not found",
      });
    }

    await deleteRow(SHEET_NAMES.BANNERS, index);

    res.json({
      ok: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// Payout Wallets Management
export const handleGetPayoutWallets: RequestHandler = async (req, res) => {
  try {
    const rows = await getRows(SHEET_NAMES.PAYOUT_WALLETS);

    const wallets: Record<string, { enabled: boolean; reserve: number }> = {};
    rows.forEach((row) => {
      wallets[row.key] = {
        enabled: row.enabled === "true",
        reserve: parseFloat(row.reserve || "0"),
      };
    });

    res.json({
      ok: true,
      wallets,
    });
  } catch (error) {
    console.error("Get payout wallets error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdatePayoutWallets: RequestHandler = async (req, res) => {
  try {
    const { wallets } = req.body;

    if (!wallets || typeof wallets !== "object") {
      return res.status(400).json({
        ok: false,
        error: "Wallets object is required",
      });
    }

    const rows = await getRows(SHEET_NAMES.PAYOUT_WALLETS);

    for (const [key, config] of Object.entries(wallets)) {
      const index = rows.findIndex((row) => row.key === key);
      const now = new Date().toISOString();
      const walletConfig = config as any;
      const values = [
        key,
        walletConfig.enabled ? "true" : "false",
        walletConfig.reserve?.toString() || "0",
        now,
      ];

      if (index !== -1) {
        await updateRow(SHEET_NAMES.PAYOUT_WALLETS, index, values);
      } else {
        await appendRow(SHEET_NAMES.PAYOUT_WALLETS, values);
      }
    }

    res.json({
      ok: true,
      message: "Payout wallets updated successfully",
    });
  } catch (error) {
    console.error("Update payout wallets error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

// Requests Management (topups, cashouts, etc.)
export const handleAddRequest: RequestHandler = async (req, res) => {
  try {
    const { phone, type, amount } = req.body;

    if (!phone || !type || !amount) {
      return res.status(400).json({
        ok: false,
        error: "Phone, type, and amount are required",
      });
    }

    const requestId = crypto.randomUUID();
    const now = new Date().toISOString();

    const requestData = [
      requestId,
      phone,
      type,
      amount.toString(),
      "pending",
      now,
    ];

    await appendRow(SHEET_NAMES.REQUESTS, requestData);

    res.status(201).json({
      ok: true,
      request: {
        id: requestId,
        phone,
        type,
        amount,
        status: "pending",
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("Add request error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetRequests: RequestHandler = async (req, res) => {
  try {
    const { type, status } = req.query;

    let rows = await getRows(SHEET_NAMES.REQUESTS);

    if (type) {
      rows = rows.filter((row) => row.type === type);
    }

    if (status) {
      rows = rows.filter((row) => row.status === status);
    }

    res.json({
      ok: true,
      requests: rows.map((row) => ({
        id: row.id,
        phone: row.phone,
        type: row.type,
        amount: parseFloat(row.amount || "0"),
        status: row.status,
        createdAt: row.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateRequestStatus: RequestHandler = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        ok: false,
        error: "Request ID and status are required",
      });
    }

    const rows = await getRows(SHEET_NAMES.REQUESTS);
    const index = rows.findIndex((row) => row.id === requestId);

    if (index === -1) {
      return res.status(404).json({
        ok: false,
        error: "Request not found",
      });
    }

    const request = rows[index];
    const updatedValues = [
      request.id,
      request.phone,
      request.type,
      request.amount,
      status,
      request.createdAt,
    ];

    await updateRow(SHEET_NAMES.REQUESTS, index, updatedValues);

    res.json({
      ok: true,
      message: "Request status updated",
    });
  } catch (error) {
    console.error("Update request status error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
