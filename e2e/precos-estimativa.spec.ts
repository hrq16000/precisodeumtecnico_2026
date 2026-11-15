import { test, expect } from "@playwright/test";

test.describe("/precos — estimativa rápida em 3 perguntas", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("mostra melhor opção e WhatsApp pré-preenchido", async ({ page }) => {
    await page.goto("/precos");
    const card = page.locator("#estimativa-rapida-card");
    await expect(card).toBeVisible();
    await expect(card.locator("[data-estimate-result]")).toHaveCount(0);

    await card.locator("[data-estimate-equipment='informatica']").click();
    await card.locator("[data-estimate-mode='bancada']").click();
    await card.locator("[data-estimate-urgency='fila']").click();

    const result = card.locator("[data-estimate-result]");
    await expect(result).toBeVisible();
    await expect(result.locator("[data-estimate-price]")).toHaveText("R$ 99,99");

    const wa = result.locator("a[data-wa-source='pricing-quick-estimate']");
    const href = await wa.getAttribute("href");
    expect(href).toContain("wa.me/");
    expect(decodeURIComponent(href ?? "")).toContain("Diagnóstico em bancada");
  });

  test("serviços de instalação são roteados para visita técnica", async ({ page }) => {
    await page.goto("/precos");
    const card = page.locator("#estimativa-rapida-card");
    await card.locator("[data-estimate-equipment='cftv']").click();
    await card.locator("[data-estimate-mode='bancada']").click();
    await card.locator("[data-estimate-urgency='prioridade']").click();
    const result = card.locator("[data-estimate-result]");
    await expect(result).toContainText("Visita técnica");
    await expect(result.locator("[data-estimate-price]")).toHaveText("A partir de R$ 99,99");
    await expect(result).toContainText("até 20 minutos");
    await expect(result).toContainText("tolerância até 30 minutos no total");
  });
});
