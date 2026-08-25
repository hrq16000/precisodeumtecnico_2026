import { test, expect } from "@playwright/test";
import {
  captureWindowOpen,
  completeConsoleTriage,
  decodeWaText,
  fillContactStep,
  mockTriageWrites,
  readOpenedWaUrl,
  submitTriage,
  suppressLocationPrompt,
  waitForStep,
} from "./utils/triage";

/**
 * Contrato: a etapa final mostra a prévia exata da mensagem do WhatsApp
 * (equipamento + problema + localidade) e, quando o Geo-IP falha, o wizard
 * pede o bairro antes de montar a mensagem.
 */
test.describe("Prévia do WhatsApp e fallback de localidade", () => {
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
    await suppressLocationPrompt(page);
  });

  test("prévia na revisão coincide com a mensagem enviada", async ({ page }) => {
    await page.goto("/triagem-preview");

    await completeConsoleTriage(page, {
      submit: false,
      contact: { city: "Curitiba", neighborhood: "Batel" },
    });
    await waitForStep(page, 7);

    await fillContactStep(page, {
      name: "Cliente Teste",
      phone: "(41) 99999-0000",
      email: "cliente@example.com",
      city: "Curitiba",
      neighborhood: "Batel",
    });

    const preview = page.getByTestId("triage-wa-preview");
    await expect(preview).toBeVisible();
    await preview.click(); // abre o <details>
    const previewText = (await page.getByTestId("triage-wa-preview-message").innerText()).trim();
    expect(previewText).toContain("Equipamento: Videogame");
    expect(previewText).toContain("Não lê disco");
    expect(previewText).toContain("Batel");

    await submitTriage(page);
    const sent = decodeWaText(await readOpenedWaUrl(page)).trim();
    expect(sent).toBe(previewText);
  });

  test("Geo-IP indisponível pede o bairro e a mensagem sai preenchida", async ({ page }) => {
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.reload();

    await completeConsoleTriage(page, { submit: false, contact: { city: "", neighborhood: "" } });
    await waitForStep(page, 7);

    // Sem geolocalização, o wizard sinaliza o fallback pedindo o bairro.
    await expect(page.getByTestId("triage-geo-fallback")).toBeVisible();

    await fillContactStep(page, {
      name: "Cliente Teste",
      phone: "(41) 99999-0000",
      email: "cliente@example.com",
      city: "Curitiba",
      neighborhood: "Portão",
    });
    await expect(page.getByTestId("triage-geo-fallback")).toHaveCount(0);

    await submitTriage(page);
    const text = decodeWaText(await readOpenedWaUrl(page));
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Problema: Não lê disco");
    expect(text).toContain("Bairro: Portão");
  });
});
