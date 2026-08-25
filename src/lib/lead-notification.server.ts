// Server-only logic for the lead-notification server function.
// Ported from the former `send-lead-notification` Supabase edge function:
// Deno `serve()` / CORS / Response plumbing removed — the TanStack server
// function wrapper (lead-notification.functions.ts) owns transport concerns.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory; resets on cold start — same semantics as before)
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(8, "Phone must be at least 8 characters").max(20, "Phone must be less than 20 characters"),
  service: z.string().max(100, "Service must be less than 100 characters").optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  website: z.string().max(0, "Invalid submission").optional(), // Honeypot field — should always be empty
});

export type LeadPayload = z.infer<typeof leadSchema>;

// ---------------------------------------------------------------------------
// Email helpers
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

function formatMessage(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

const RETRY_DELAYS_MS = [400, 1200, 3000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** When true, outbound providers are mocked (local dev / offline). */
function isMockMode(): boolean {
  return process.env["MOCK_EXTERNAL_APIS"] === "true";
}

async function sendResendEmail(
  apiKey: string,
  payload: { from: string; to: string[]; subject: string; html: string },
): Promise<unknown> {
  if (isMockMode()) {
    console.log("[lead-notification][mock] resend email", {
      to: payload.to,
      subject: payload.subject,
    });
    return { mocked: true, id: `mock_${Date.now()}` };
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // Retry only on transient failures (429 / 5xx).
      if (res.status === 429 || res.status >= 500) {
        lastError = `HTTP ${res.status}`;
        console.warn("[lead-notification] resend transient failure", {
          attempt,
          status: res.status,
        });
      } else {
        return await res.json();
      }
    } catch (error) {
      lastError = error;
      console.warn("[lead-notification] resend network failure", { attempt, error: String(error) });
    }

    const delay = RETRY_DELAYS_MS[attempt];
    if (delay !== undefined) await sleep(delay);
  }

  console.error("[lead-notification] resend exhausted retries", { error: String(lastError) });
  return { error: "resend_unavailable", detail: String(lastError) };
}

export async function sendLeadEmails(leadData: LeadPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.error("[send-lead-notification] RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured" };
  }

  const safeName = escapeHtml(leadData.name);
  const safeEmail = escapeHtml(leadData.email);
  const safePhone = escapeHtml(leadData.phone);
  const safeService = leadData.service ? escapeHtml(leadData.service) : null;
  const safeCity = leadData.city ? escapeHtml(leadData.city) : null;
  const safeMessage = formatMessage(leadData.message);

  const cleanPhone = leadData.phone.replace(/\D/g, "");

  const businessEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1565c0, #0288d1); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1565c0; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #1565c0; }
        .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #ff9800; margin-top: 10px; }
        .cta { display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎯 Novo Lead Recebido!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Preciso de Um Técnico</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nome</div>
            <div class="value">${safeName}</div>
          </div>
          <div class="field">
            <div class="label">📧 E-mail</div>
            <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">📱 Telefone/WhatsApp</div>
            <div class="value">${safePhone}</div>
          </div>
          ${safeService ? `
          <div class="field">
            <div class="label">🔧 Serviço Solicitado</div>
            <div class="value">${safeService}</div>
          </div>
          ` : ""}
          ${safeCity ? `
          <div class="field">
            <div class="label">📍 Cidade</div>
            <div class="value">${safeCity}</div>
          </div>
          ` : ""}
          <div class="field">
            <div class="label">💬 Mensagem</div>
            <div class="message-box">${safeMessage}</div>
          </div>
          <a href="https://wa.me/55${cleanPhone}?text=Olá ${encodeURIComponent(leadData.name)}! Recebemos sua solicitação no Preciso de Um Técnico. Como posso ajudá-lo?" class="cta">
            💬 Responder via WhatsApp
          </a>
        </div>
        <div class="footer">
          Este e-mail foi enviado automaticamente pelo sistema Preciso de Um Técnico.
        </div>
      </div>
    </body>
    </html>
  `;

  const businessResult = await sendResendEmail(apiKey, {
    from: "Preciso de Um Técnico <onboarding@resend.dev>",
    to: ["contato@precisodeumtecnico.com"],
    subject: `🎯 Novo Lead: ${safeName} - ${safeService || "Serviço Geral"}`,
    html: businessEmailHtml,
  });
  console.log("Business notification email result:", businessResult);

  const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1565c0, #0288d1); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta { display: inline-block; background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
        .cta-phone { display: inline-block; background: #1565c0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
        .footer { background: #333; color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
        .footer a { color: #4fc3f7; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✅ Recebemos sua Solicitação!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Preciso de Um Técnico</p>
        </div>
        <div class="content">
          <p>Olá <strong>${safeName}</strong>,</p>
          <p>Recebemos sua solicitação de serviço técnico e nossa equipe já está analisando!</p>

          <div class="highlight">
            <p style="margin: 0;"><strong>📋 Resumo da sua solicitação:</strong></p>
            ${safeService ? `<p style="margin: 10px 0 0 0;">🔧 Serviço: <strong>${safeService}</strong></p>` : ""}
            ${safeCity ? `<p style="margin: 5px 0 0 0;">📍 Cidade: <strong>${safeCity}</strong></p>` : ""}
          </div>

          <p><strong>O que acontece agora?</strong></p>
          <ul>
            <li>Nossa equipe vai analisar sua solicitação</li>
            <li>Entraremos em contato em breve com um orçamento</li>
            <li>Você pode agendar o melhor horário para o atendimento</li>
          </ul>

          <p><strong>Precisa de atendimento mais rápido?</strong></p>
          <p style="text-align: center;">
            <a href="https://wa.me/5541997452053?text=Olá! Acabei de enviar uma solicitação pelo site e gostaria de um atendimento mais rápido." class="cta">💬 WhatsApp 24h</a>
            <a href="tel:+5541997452053" class="cta-phone">📞 Ligar Agora</a>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;"><strong>Preciso de Um Técnico</strong></p>
          <p style="margin: 5px 0;">A maior rede de técnicos do Brasil</p>
          <p style="margin: 10px 0 0 0;"><a href="https://precisodeumtecnico.com">precisodeumtecnico.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const customerResult = await sendResendEmail(apiKey, {
    from: "Preciso de Um Técnico <onboarding@resend.dev>",
    to: [leadData.email],
    subject: "✅ Recebemos sua solicitação - Preciso de Um Técnico",
    html: customerEmailHtml,
  });
  console.log("Customer confirmation email result:", customerResult);

  return { success: true };
}
