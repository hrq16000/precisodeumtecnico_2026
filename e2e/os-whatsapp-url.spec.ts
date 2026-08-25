import { test, expect, type Page } from "@playwright/test";

/**
 * Contrato do CTA final da abertura de Ordem de Serviço:
 * a URL do WhatsApp precisa sair sempre pré-preenchida com o código único,
 * o equipamento/serviço, a localidade e a síntese operacional aceita.
 */

async function fillOrder(page: Page, opts: { city: string; neighborhood?: string }) {
  await page.goto("/abrir-os");
  await expect(page.getByTestId("os-protocol")).toBeVisible();

  await page.locator('[data-field="name"]').fill("Cliente Teste");
  await page.locator('[data-field="equipment"]').fill("Notebook Dell");
  await page.locator('[data-field="problem"]').fill("Não liga depois de queda de energia");
  await page.locator('[data-field="city"]').fill(opts.city);
  if (opts.neighborhood) await page.locator('[data-field="neighborhood"]').fill(opts.neighborhood);
  await page.locator('[data-field="acceptedTerms"]').check();

  const review = page.getByTestId("os-review");
  if (await review.count()) await review.click();

  const cta = page.getByTestId("os-submit");
  await expect(cta).toBeVisible();
  return {
    protocol: (await page.getByTestId("os-protocol").innerText()).trim(),
    href: (await cta.getAttribute("href")) ?? "",
  };
}

function decodedText(href: string): string {
  const url = new URL(href);
  return decodeURIComponent(url.searchParams.get("text") ?? "");
}

test("CTA final monta a URL do WhatsApp com código, equipamento e localidade", async ({ page }) => {
  const { protocol, href } = await fillOrder(page, { city: "Curitiba", neighborhood: "Portão" });

  expect(protocol).toMatch(/^OS-\d{4}-[A-Z0-9]{6}$/);
  expect(href).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)/);

  const text = decodedText(href);
  expect(text).toContain(protocol);
  expect(text).toContain("Notebook Dell");
  expect(text).toContain("Curitiba");
  expect(text).toContain("Portão");
  expect(text).toContain("Modalidade");
  expect(text).toMatch(/LIDOS E ACEITOS/);
});

test("fallback de localidade: sem Geo-IP a URL continua íntegra", async ({ page }) => {
  // Simula Geo-IP indisponível: qualquer chamada de geolocalização falha.
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (/ipapi|ipinfo|geoip|ip-api/i.test(url)) return route.abort();
    return route.fallback();
  });

  const { protocol, href } = await fillOrder(page, { city: "São José dos Pinhais" });
  const text = decodedText(href);

  expect(href).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)/);
  expect(text).toContain(protocol);
  expect(text).toContain("São José dos Pinhais");
  expect(text).toContain("Notebook Dell");
});

test("conclusão gera comprovante com QR code e consulta pelo código", async ({ page }) => {
  const { protocol } = await fillOrder(page, { city: "Curitiba" });

  await page.getByTestId("os-submit").click({ modifiers: [] }).catch(() => undefined);
  const receipt = page.getByTestId("os-receipt");
  await expect(receipt).toBeVisible();
  await expect(receipt.locator("[data-qr-code]")).toHaveCount(1);
  await expect(page.getByTestId("os-pdf")).toBeVisible();

  await page.goto(`/consultar-os?os=${encodeURIComponent(protocol)}`);
  await expect(page.getByTestId("consultar-os-result")).toBeVisible();
  await expect(page.getByTestId("consultar-os-protocol")).toHaveText(protocol);
  await expect(page.getByTestId("consultar-os-equipment")).toContainText("Notebook Dell");
  await expect(page.getByTestId("consultar-os-message")).toContainText(protocol);
});
