// Server function replacing the send-lead-notification edge function.
// Thin wrapper: all runtime logic lives in lead-notification.server.ts.

import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import type { LeadPayload } from "./lead-notification.server";

export const sendLeadNotification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): LeadPayload & { website?: string } => data as LeadPayload & { website?: string })
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    const { checkRateLimit, leadSchema, sendLeadEmails } = await import("./lead-notification.server");

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      console.warn(`[send-lead-notification] rate limit exceeded for IP: ${ip}`);
      return { success: false, error: "Too many requests. Please try again later." };
    }

    // Honeypot — pretend success so bots aren't alerted.
    if (data.website && data.website.length > 0) {
      console.warn(`[send-lead-notification] honeypot triggered from IP: ${ip}`);
      return { success: true };
    }

    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      console.error("[send-lead-notification] validation error:", parsed.error.flatten());
      return { success: false, error: "Invalid input data" };
    }

    try {
      return await sendLeadEmails(parsed.data);
    } catch (error) {
      console.error("[send-lead-notification] error:", error);
      return { success: false, error: "An error occurred processing your request" };
    }
  });
