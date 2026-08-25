import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  
  return cfConnectingIp || realIp || forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
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
    // New window
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

// Input validation schema with honeypot field
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(8, "Phone must be at least 8 characters").max(20, "Phone must be less than 20 characters"),
  service: z.string().max(100, "Service must be less than 100 characters").optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  website: z.string().max(0, "Invalid submission").optional(), // Honeypot field - should always be empty
});

// HTML escape function to prevent HTML injection in emails
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

// Convert newlines to <br> tags safely (after escaping)
function formatMessage(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send lead notification");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIp = getRateLimitKey(req);
  const rateLimitResult = checkRateLimit(clientIp);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json", 
          "Retry-After": String(rateLimitResult.retryAfter),
          ...corsHeaders 
        },
      }
    );
  }

  try {
    const rawData = await req.json();
    
    // Check honeypot field - if filled, it's likely a bot
    if (rawData.website && rawData.website.length > 0) {
      console.warn(`Honeypot triggered from IP: ${clientIp}`);
      // Return success to not alert the bot, but don't process
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Validate input data
    const parseResult = leadSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data", 
          details: parseResult.error.flatten().fieldErrors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const leadData = parseResult.data;
    console.log("Lead data validated:", { name: leadData.name, email: leadData.email, service: leadData.service });

    // Escape all user-provided data for safe HTML insertion
    const safeName = escapeHtml(leadData.name);
    const safeEmail = escapeHtml(leadData.email);
    const safePhone = escapeHtml(leadData.phone);
    const safeService = leadData.service ? escapeHtml(leadData.service) : null;
    const safeCity = leadData.city ? escapeHtml(leadData.city) : null;
    const safeMessage = formatMessage(leadData.message);

    // Clean phone number for WhatsApp link (only digits)
    const cleanPhone = leadData.phone.replace(/\D/g, '');

    // Email to the business owner
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
            ` : ''}
            ${safeCity ? `
            <div class="field">
              <div class="label">📍 Cidade</div>
              <div class="value">${safeCity}</div>
            </div>
            ` : ''}
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

    // Send notification to business owner using Resend API directly
    const businessEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preciso de Um Técnico <onboarding@resend.dev>",
        to: ["contato@precisodeumtecnico.com"], // Change to actual business email
        subject: `🎯 Novo Lead: ${safeName} - ${safeService || 'Serviço Geral'}`,
        html: businessEmailHtml,
      }),
    });

    const businessResult = await businessEmailResponse.json();
    console.log("Business notification email result:", businessResult);

    // Email confirmation to the customer
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
              ${safeService ? `<p style="margin: 10px 0 0 0;">🔧 Serviço: <strong>${safeService}</strong></p>` : ''}
              ${safeCity ? `<p style="margin: 5px 0 0 0;">📍 Cidade: <strong>${safeCity}</strong></p>` : ''}
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

    // Send confirmation to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preciso de Um Técnico <onboarding@resend.dev>",
        to: [leadData.email],
        subject: "✅ Recebemos sua solicitação - Preciso de Um Técnico",
        html: customerEmailHtml,
      }),
    });

    const customerResult = await customerEmailResponse.json();
    console.log("Customer confirmation email result:", customerResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        businessEmail: businessResult,
        customerEmail: customerResult 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
