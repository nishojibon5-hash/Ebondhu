import crypto from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!adminPassword || !secret) {
    res.status(500).json({
      ok: false,
      error:
        "Server missing ADMIN_PASSWORD or ADMIN_JWT_SECRET. Configure environment variables.",
    });
    return;
  }
  if (!password || typeof password !== "string") {
    res.status(400).json({ ok: false, error: "Password is required" });
    return;
  }
  if (password !== adminPassword) {
    res.status(401).json({ ok: false, error: "Invalid credentials" });
    return;
  }
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "admin",
    role: "admin",
    iat: now,
    exp: now + 60 * 60 * 8,
  };
  const token = signHS256({ alg: "HS256", typ: "JWT" }, payload, secret);
  res.status(200).json({ ok: true, token, role: "admin" });
}
