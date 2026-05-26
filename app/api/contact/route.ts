import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_PROJECT_TYPES } from "@/lib/contactProjectTypes";

export const runtime = "nodejs";

const MAX = { name: 200, message: 20_000 };

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, {
      status: 400,
    });
  }

  const honeypot =
    typeof body._company === "string" ? body._company.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const projectType =
    typeof body.project_type === "string" ? body.project_type.trim() : "";
  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > MAX.name) {
    return NextResponse.json({ ok: false, error: "Invalid name." }, {
      status: 400,
    });
  }
  if (!email || !isValidEmail(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, {
      status: 400,
    });
  }
  if (
    !(CONTACT_PROJECT_TYPES as readonly string[]).includes(projectType)
  ) {
    return NextResponse.json({ ok: false, error: "Invalid project type." }, {
      status: 400,
    });
  }
  if (!message || message.length > MAX.message) {
    return NextResponse.json({ ok: false, error: "Invalid message." }, {
      status: 400,
    });
  }

  const host = process.env.ZOHO_SMTP_HOST?.trim() || "smtp.zoho.com";
  const port = Number(process.env.ZOHO_SMTP_PORT?.trim() || "465");
  const user = process.env.ZOHO_SMTP_USER?.trim();
  const pass = process.env.ZOHO_SMTP_PASS?.trim();
  const rawNotify = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  const to =
    rawNotify && rawNotify.length > 0 ? rawNotify : "info@technityze.com";

  if (!user || !pass) {
    console.error(
      "[api/contact] Missing ZOHO_SMTP_USER or ZOHO_SMTP_PASS env vars.",
    );
    return NextResponse.json(
      {
        ok: false,
        error: "Mail is not configured. Please email us directly.",
      },
      { status: 503 },
    );
  }

  const secure = port === 465;
  const useStartTls = port === 587;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    ...(useStartTls ? { requireTLS: true } : {}),
    auth: { user, pass },
  });

  const subject = `${projectType} — ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Project type: ${projectType}`,
    "",
    message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Project type:</strong> ${escapeHtml(projectType)}</p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Technityze site" <${user}>`,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[api/contact] SMTP send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not send message. Try again or email info@technityze.com.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
