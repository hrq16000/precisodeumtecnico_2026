import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test("leva a localidade selecionada da home para a triagem", async ({ page }) => {
  await page.goto("/");
  const widget = page.getByTestId("smart-search");
  const city = widget.getByRole("combobox", { name: "Cidade ou bairro" });
  await city.fill("Batel");
  const suggestion = widget.getByRole("option", { name: "Batel, Curitiba", exact: true });
  await suggestion.click();
  await expect(city).toHaveValue("Batel, Curitiba");

  await widget.getByTestId("smart-search-triage").click();
  await expect(page).toHaveURL((url) =>
    url.searchParams.get("cidade") === "Curitiba" &&
    url.searchParams.get("bairro") === "Batel",
  );
  await expect(page.getByRole("dialog", { name: "Triagem técnica" })).toBeVisible({ timeout: 15_000 });
});
