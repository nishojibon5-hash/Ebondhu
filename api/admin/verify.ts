import crypto from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function base64url(input: Buffer | string) {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const auth = (req.headers["authorization"] as string) || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    res.status(500).json({ ok: false, error: "Server missing ADMIN_JWT_SECRET. Configure environment variable." });
    return;
  }
  if (!token) {
    res.status(401).json({ ok: false, error: "Missing token" });
    return;
  }
  const payload = verifyHS256(token, secret);
  if (!payload || payload.role !== "admin") {
    res.status(401).json({ ok: false, error: "Invalid token" });
    return;
  }
  res.status(200).json({ ok: true, role: payload.role });
}
