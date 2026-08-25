import { test, expect } from "@playwright/test";

/**
 * Deep-link de agendamento (#agendamento / #triagem) — usado nos links de
 * agendamento on-line do Google Business Profile. Deve abrir a triagem em
 * popup em qualquer rota e limpar o hash da URL.
 */
const ROUTES = ["/", "/assistencia-tecnica-curitiba", "/precos"];

for (const route of ROUTES) {
  test(`#agendamento abre a triagem em ${route}`, async ({ page }) => {
    await page.goto(`${route}#agendamento`);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    // hash limpo para não reabrir no back/refresh
    await expect.poll(() => new URL(page.url()).hash, { timeout: 5_000 }).toBe("");
  });
}

test("#triagem também abre e aceita contexto por querystring", async ({ page }) => {
  await page.goto("/?cidade=Curitiba&bairro=Mercês#triagem");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });
});

test("hash desconhecido não abre a triagem", async ({ page }) => {
  await page.goto("/#faq");
  await page.waitForTimeout(1500);
  await expect(page.getByRole("dialog", { name: /Triagem t/i })).toHaveCount(0);
});

test("recarregar com #agendamento restaura o rascunho da triagem", async ({ page }) => {
  await page.goto("/?cidade=Curitiba&bairro=Batel#agendamento");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

  // Avança a etapa 1 para gerar rascunho persistido.
  await page.getByRole("button", { name: /^Videogame/ }).first().click();
  await expect(page.getByText("Etapa 2/7")).toBeVisible({ timeout: 20_000 });

  await page.goto("/?cidade=Curitiba&bairro=Batel#agendamento");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });
  // Estado preservado: continua na etapa de identificação do videogame.
  await expect(page.getByText("Etapa 2/7")).toBeVisible({ timeout: 20_000 });
});
