import { test, expect, type Page } from "@playwright/test";

/**
 * Consent Mode v2 — contrato de comportamento do banner LGPD.
 *
 * Valida, em desktop e mobile:
 *  - o banner aparece para visitante sem decisão;
 *  - "Aceitar" empurra consent=update com granted (ads + analytics);
 *  - "Recusar" empurra consent=update com denied em tudo;
 *  - a decisão persiste (banner não reaparece);
 *  - o link de política abre /politica-privacidade.
 */

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

type ConsentPayload = Record<string, string>;

async function lastConsentUpdate(page: Page): Promise<ConsentPayload | null> {
  return page.evaluate(() => {
    const dl = ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []) as unknown[];
    const updates = dl.filter(
      (e) => Array.isArray(e) && e[0] === "consent" && e[1] === "update",
    ) as unknown[][];
    const last = updates[updates.length - 1];
    return last ? (last[2] as ConsentPayload) : null;
  });
}

function banner(page: Page) {
  return page.locator("[data-cookie-consent]");
}

for (const vp of VIEWPORTS) {
  test.describe(`consent mode v2 · ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("Aceitar concede medição e publicidade", async ({ page }) => {
      await page.goto("/");
      await expect(banner(page)).toBeVisible({ timeout: 20_000 });

      await banner(page).getByRole("button", { name: "Aceitar" }).click();
      await expect(banner(page)).toHaveCount(0);

      const payload = await lastConsentUpdate(page);
      expect(payload).toBeTruthy();
      expect(payload).toMatchObject({
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });

      // Persistência: nova visita não mostra o banner novamente.
      await page.goto("/contato");
      await expect(banner(page)).toHaveCount(0);
    });

    test("Recusar nega todas as categorias", async ({ page }) => {
      await page.goto("/");
      await expect(banner(page)).toBeVisible({ timeout: 20_000 });

      await banner(page).getByRole("button", { name: "Recusar" }).click();
      await expect(banner(page)).toHaveCount(0);

      const payload = await lastConsentUpdate(page);
      expect(payload).toMatchObject({
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });

      // Sem consentimento não pode existir tag do Google carregada.
      const googleScripts = await page
        .locator(
          'script[src*="googletagmanager.com"], script[src*="pagead2.googlesyndication.com"]',
        )
        .count();
      expect(googleScripts).toBe(0);
    });

    test("link de política abre /politica-privacidade", async ({ page }) => {
      await page.goto("/");
      await expect(banner(page)).toBeVisible({ timeout: 20_000 });

      await banner(page).getByRole("link", { name: "Privacidade" }).click();
      await expect(page).toHaveURL(/\/politica-privacidade$/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("preferências granulares: só medição", async ({ page }) => {
      await page.goto("/");
      await banner(page).getByRole("button", { name: "Preferências" }).click();
      await banner(page).getByRole("switch", { name: "Permitir cookies de publicidade" }).click();
      await banner(page).getByRole("button", { name: "Salvar preferências" }).click();

      const payload = await lastConsentUpdate(page);
      expect(payload).toMatchObject({
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_personalization: "denied",
      });
    });
  });
}
