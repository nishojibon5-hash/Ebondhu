import { RequestHandler } from "express";
import { appendRow, findRow, findRows, getRows, updateRow, SHEET_NAMES } from "../services/sheets";
import crypto from "crypto";

export const handleUserLogin: RequestHandler = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({
        ok: false,
        error: "Phone and PIN are required",
      });
    }

    if (phone.length !== 11) {
      return res.status(400).json({
        ok: false,
        error: "Invalid phone number format",
      });
    }

    if (pin.length !== 5) {
      return res.status(400).json({
        ok: false,
        error: "PIN must be 5 digits",
      });
    }

    // Find user in Google Sheets
    const user = await findRow(SHEET_NAMES.USERS, "phone", phone);

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "User not found",
      });
    }

    if (user.pin !== pin) {
      return res.status(401).json({
        ok: false,
        error: "Invalid credentials",
      });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        balance: parseFloat(user.balance || "0"),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUserRegister: RequestHandler = async (req, res) => {
  try {
    const { phone, name, pin } = req.body;

    if (!phone || !name || !pin) {
      return res.status(400).json({
        ok: false,
        error: "Phone, name, and PIN are required",
      });
    }

    if (phone.length !== 11) {
      return res.status(400).json({
        ok: false,
        error: "Invalid phone number format",
      });
    }

    if (pin.length !== 5) {
      return res.status(400).json({
        ok: false,
        error: "PIN must be 5 digits",
      });
    }

    // Check if user already exists
    const existingUser = await findRow(SHEET_NAMES.USERS, "phone", phone);
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        error: "User already registered",
      });
    }

    // Create new user
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    const userData = [
      userId,
      phone,
      name,
      pin,
      "0", // Initial balance
      now,
      now,
    ];

    await appendRow(SHEET_NAMES.USERS, userData);

    res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user: {
        id: userId,
        phone,
        name,
        balance: 0,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetUser: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        ok: false,
        error: "Phone number is required",
      });
    }

    const user = await findRow(SHEET_NAMES.USERS, "phone", phone);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "User not found",
      });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        balance: parseFloat(user.balance || "0"),
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateUserBalance: RequestHandler = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || amount === undefined) {
      return res.status(400).json({
        ok: false,
        error: "Phone and amount are required",
      });
    }

    const rows = await getRows(SHEET_NAMES.USERS);
    const userIndex = rows.findIndex((row) => row.phone === phone);

    if (userIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: "User not found",
      });
    }

    const user = rows[userIndex];
    const newBalance = (parseFloat(user.balance || "0") + parseFloat(amount)).toString();
    const now = new Date().toISOString();

    const updatedValues = [
      user.id,
      user.phone,
      user.name,
      user.pin,
      newBalance,
      user.createdAt,
      now,
    ];

    await updateRow(SHEET_NAMES.USERS, userIndex, updatedValues);

    res.json({
      ok: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        balance: parseFloat(newBalance),
      },
    });
  } catch (error) {
    console.error("Update balance error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};

export const handleGetAllUsers: RequestHandler = async (req, res) => {
  try {
    const rows = await getRows(SHEET_NAMES.USERS);

    res.json({
      ok: true,
      users: rows.map((row) => ({
        id: row.id,
        phone: row.phone,
        name: row.name,
        balance: parseFloat(row.balance || "0"),
      })),
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
