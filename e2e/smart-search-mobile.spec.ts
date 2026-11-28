import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

// Synthetic returning visitor: analytics and ads explicitly declined. The
// consent banner has its own tests; do not send real data during this QA.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pdt_consent_prefs_v1", JSON.stringify({ analytics: false, ads: false, decidedAt: new Date().toISOString(), version: 1 }));
    localStorage.setItem("pdt_cookie_consent_v1", "denied");
  });
});

test("leva a localidade selecionada da home para a triagem", async ({ page }) => {
  await page.goto("/");
  const widget = page.getByTestId("smart-search");
  const equipment = widget.getByRole("combobox", { name: "Equipamento ou serviço" });
  await expect(equipment).toHaveAttribute("aria-labelledby", "smart-search-equipment-label");
  await expect(widget.locator("#smart-search-equipment-label")).toHaveText("Equipamento ou serviço");
  await equipment.fill("notebook");
  await widget.getByRole("option", { name: "PC / Notebook", exact: true }).click();
  await expect(equipment).toHaveAttribute("data-choice-value", "pc_notebook");
  const city = widget.getByRole("combobox", { name: "Cidade ou bairro" });
  await city.fill("Batel");
  const suggestion = widget.getByRole("option", { name: "Batel, Curitiba", exact: true });
  await suggestion.click();
  await expect(city).toHaveValue("Batel, Curitiba");

  await widget.getByTestId("smart-search-triage").click();
  await expect(page).toHaveURL((url) =>
    url.pathname === "/" && url.searchParams.get("equipamento") === "pc_notebook" &&
    url.searchParams.get("cidade") === "Curitiba" &&
    url.searchParams.get("bairro") === "Batel",
  );
  await expect(page.getByRole("dialog", { name: "Triagem técnica" })).toBeVisible({ timeout: 15_000 });
});

for (const width of [390, 768, 1440]) {
  test(`contato: serviço e cidade pesquisáveis sem submissão em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contato");
    const service = page.getByRole("combobox", { name: "Tipo de serviço", exact: true });
    await expect(service).toBeEnabled({ timeout: 15000 });
    await service.fill("informatica");
    await page.getByRole("option", { name: "Informática", exact: true }).click();
    await expect(service).toHaveAttribute("data-choice-value", "Informática");
    const city = page.getByRole("combobox", { name: "Cidade", exact: true });
    await expect(city).toBeEnabled({ timeout: 15000 });
    await city.fill("sao jose");
    await expect(city).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
    await page.getByRole("option", { name: "São José dos Pinhais", exact: true }).click();
    await expect(city).toHaveAttribute("data-choice-value", "São José dos Pinhais");
    await city.fill("inexistente");
    await expect(page.getByText("Nenhuma opção encontrada. Tente outro termo.")).toBeVisible();
    await city.press("Escape");
    await expect(city).toHaveValue("São José dos Pinhais");
    // No mobile, exercitar também o toque real sem depender de clique forçado.
    if (width === 390) {
      await city.fill("pinhais");
      await page.getByRole("option", { name: "Pinhais", exact: true }).tap();
      await expect(city).toHaveAttribute("data-choice-value", "Pinhais");
    }
    await expect(page).toHaveURL(/\/contato(?:[?#]|$)/);
  });
}
