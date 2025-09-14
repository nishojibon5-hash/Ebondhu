import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { handleDemo } from "./routes/demo";

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

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
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

  return app;
}
