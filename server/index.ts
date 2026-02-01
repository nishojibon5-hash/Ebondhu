import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";
import multer from "multer";
import { handleDemo } from "./routes/demo";
import { initializeSheets } from "./services/sheets";
import {
  handleUserLogin,
  handleUserRegister,
  handleGetUser,
  handleUpdateUserBalance,
  handleGetAllUsers,
  handleDeleteUser,
} from "./routes/users";
import {
  handleAddTransaction,
  handleGetUserTransactions,
  handleGetAllTransactions,
  handleUpdateTransactionStatus,
} from "./routes/transactions";
import {
  handleGetFeatureFlags,
  handleUpdateFeatureFlags,
  handleGetBanners,
  handleAddBanner,
  handleDeleteBanner,
  handleGetPayoutWallets,
  handleUpdatePayoutWallets,
  handleAddRequest,
  handleGetRequests,
  handleUpdateRequestStatus,
} from "./routes/admin-data";
import {
  handleUploadImage,
  handleUploadAudio,
  handleUploadVideo,
  handleUploadUserPhoto,
  handleUploadFile,
} from "./routes/media";
import {
  handleCreatePost,
  handleGetFeed,
  handleGetUserPosts,
  handleDeletePost,
  handleAddComment,
  handleGetPostComments,
  handleDeleteComment,
  handleToggleLike,
  handleGetPostLikes,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
  handleGetFriendRequests,
  handleGetFriends,
  handleRemoveFriend,
  handleCreateStory,
  handleGetStories,
  handleGetUserStories,
  handleDeleteStory,
} from "./routes/social";

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

function base64url(input: Buffer | string) {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signHS256(header: object, payload: object, secret: string) {
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest();
  const sigB64 = base64url(signature);
  return `${data}.${sigB64}`;
}

function verifyHS256(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expectedSig = base64url(
    crypto.createHmac("sha256", secret).update(data).digest(),
  );
  if (sig !== expectedSig) return null;
  const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Google Sheets on startup (non-blocking)
  initializeSheets().catch((error) => {
    console.warn(
      "Google Sheets initialization warning (non-blocking):",
      error.message,
    );
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Diagnostic endpoint to test Google Sheets API
  app.get("/api/debug/sheets", async (_req, res) => {
    try {
      const { getSheetsAPI, SHEET_NAMES } = await import("./services/sheets");
      const sheets = getSheetsAPI();

      const spreadsheetId = process.env.VITE_GOOGLE_SHEETS_ID || "";
      if (!spreadsheetId) {
        return res.status(400).json({
          ok: false,
          error: "VITE_GOOGLE_SHEETS_ID not configured",
        });
      }

      const result = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      res.json({
        ok: true,
        message: "Google Sheets API is working!",
        spreadsheetTitle: result.data.properties?.title,
        sheetCount: result.data.sheets?.length || 0,
        sheets: result.data.sheets?.map((s) => s.properties?.title),
      });
    } catch (error) {
      console.error("Sheets API error:", error);
      res.status(500).json({
        ok: false,
        error: String(error),
      });
    }
  });

  app.get("/api/demo", handleDemo);

  // Admin auth endpoints
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!adminPassword || !secret) {
      return res.status(500).json({
        ok: false,
        error:
          "Server missing ADMIN_PASSWORD or ADMIN_JWT_SECRET. Configure environment variables.",
      });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ ok: false, error: "Password is required" });
    }
    if (password !== adminPassword) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: "admin",
      role: "admin",
      iat: now,
      exp: now + 60 * 60 * 8,
    };
    const token = signHS256({ alg: "HS256", typ: "JWT" }, payload, secret);
    res.json({ ok: true, token, role: "admin" });
  });

  app.get("/api/admin/verify", (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        ok: false,
        error:
          "Server missing ADMIN_JWT_SECRET. Configure environment variable.",
      });
    }
    if (!token)
      return res.status(401).json({ ok: false, error: "Missing token" });
    const payload = verifyHS256(token, secret);
    if (!payload || payload.role !== "admin") {
      return res.status(401).json({ ok: false, error: "Invalid token" });
    }
    res.json({ ok: true, role: payload.role });
  });

  // Admin middleware to verify JWT token
  const adminMiddleware = (req: Request, res: any, next: any) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        ok: false,
        error: "Server missing ADMIN_JWT_SECRET",
      });
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: "Missing authorization token",
      });
    }

    const payload = verifyHS256(token, secret);
    if (!payload || payload.role !== "admin") {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized",
      });
    }

    next();
  };

  // User Management Routes
  app.post("/api/users/login", handleUserLogin);
  app.post("/api/users/register", handleUserRegister);
  app.get("/api/users/:phone", handleGetUser);
  app.post("/api/users/balance", handleUpdateUserBalance);
  app.get("/api/users", handleGetAllUsers);

  // Admin-only routes
  app.delete("/api/admin/users/:phone", adminMiddleware, handleDeleteUser);

  // Transaction Routes
  app.post("/api/transactions", handleAddTransaction);
  app.get("/api/transactions/:phone", handleGetUserTransactions);
  app.get("/api/transactions", handleGetAllTransactions);
  app.post("/api/transactions/status", handleUpdateTransactionStatus);

  // Admin Data Routes - Feature Flags
  app.get("/api/admin/feature-flags", handleGetFeatureFlags);
  app.post("/api/admin/feature-flags", handleUpdateFeatureFlags);

  // Admin Data Routes - Banners
  app.get("/api/admin/banners", handleGetBanners);
  app.post("/api/admin/banners", handleAddBanner);
  app.delete("/api/admin/banners", handleDeleteBanner);

  // Admin Data Routes - Payout Wallets
  app.get("/api/admin/payout-wallets", handleGetPayoutWallets);
  app.post("/api/admin/payout-wallets", handleUpdatePayoutWallets);

  // Admin Data Routes - Requests
  app.post("/api/admin/requests", handleAddRequest);
  app.get("/api/admin/requests", handleGetRequests);
  app.post("/api/admin/requests/status", handleUpdateRequestStatus);

  // Media Upload Routes
  app.post("/api/media/upload/image", upload.single("file"), handleUploadImage);
  app.post("/api/media/upload/audio", upload.single("file"), handleUploadAudio);
  app.post("/api/media/upload/video", upload.single("file"), handleUploadVideo);
  app.post(
    "/api/media/upload/photo",
    upload.single("file"),
    handleUploadUserPhoto,
  );
  app.post("/api/media/upload/file", upload.single("file"), handleUploadFile);

  // Social Media Routes - Posts
  app.post("/api/social/posts", handleCreatePost);
  app.get("/api/social/feed", handleGetFeed);
  app.get("/api/social/posts/:userPhone", handleGetUserPosts);
  app.delete("/api/social/posts/:postId", handleDeletePost);

  // Social Media Routes - Comments
  app.post("/api/social/comments", handleAddComment);
  app.get("/api/social/comments/:postId", handleGetPostComments);
  app.delete("/api/social/comments/:commentId", handleDeleteComment);

  // Social Media Routes - Likes
  app.post("/api/social/likes", handleToggleLike);
  app.get("/api/social/likes/:postId", handleGetPostLikes);

  // Social Media Routes - Friends
  app.post("/api/social/friend-requests", handleSendFriendRequest);
  app.post("/api/social/friend-requests/:requestId/accept", handleAcceptFriendRequest);
  app.post("/api/social/friend-requests/:requestId/reject", handleRejectFriendRequest);
  app.get("/api/social/friend-requests/:userPhone", handleGetFriendRequests);
  app.get("/api/social/friends/:userPhone", handleGetFriends);
  app.post("/api/social/friends/remove", handleRemoveFriend);

  return app;
}
