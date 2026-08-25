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
 * Contrato do funil V2: ao concluir a triagem, o wizard abre o WhatsApp via
 * window.open com a mensagem já montada (equipamento, problema, cidade,
 * bairro e sufixo de tracking). Nunca inventa cidade/bairro.
 */
test.describe("Triage WhatsApp flow (V2)", () => {
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
    await suppressLocationPrompt(page);
  });

  test("triagem completa usa cidade/bairro salvos e monta a mensagem com contexto", async ({ page }) => {
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.setItem("user_location_full_v1", JSON.stringify({
        source: "gps",
        city: "Curitiba",
        uf: "PR",
        neighborhood: "Batel",
      }));
    });
    await page.reload();

    await completeConsoleTriage(page, { contact: { city: "Curitiba", neighborhood: "Batel" } });

    const href = await readOpenedWaUrl(page);
    expect(href).toContain("wa.me/");
    const text = decodeWaText(href);
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Problema: Não lê disco");
    expect(text).toContain("Cidade: Curitiba");
    expect(text).toContain("Bairro: Batel");
    expect(text).toContain("cat=videogame");
  });

  test("triagem sem localização não inventa Curitiba", async ({ page }) => {
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.reload();

    await completeConsoleTriage(page, { contact: { city: "", neighborhood: "Centro" } });

    const href = await readOpenedWaUrl(page);
    const text = decodeWaText(href);
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Problema: Não lê disco");
    expect(text).not.toContain("Cidade: Curitiba");
  });

  test("etapa 6 (Termos) exige aceite e a etapa final pré-preenche a mensagem", async ({ page }) => {
    await page.goto("/triagem-preview");

    // Não envia ainda: valida o estado da revisão antes do WhatsApp.
    await completeConsoleTriage(page, {
      submit: false,
      contact: { city: "Curitiba", neighborhood: "Batel" },
    });

    await waitForStep(page, 7);
    // .first(): a prévia da mensagem (details) repete os mesmos rótulos.
    await expect(page.getByText("Equipamento:").first()).toBeVisible();
    await expect(page.getByText("Não lê disco").first()).toBeVisible();


    await fillContactStep(page, {
      name: "Cliente Teste",
      phone: "(41) 99999-0000",
      email: "cliente@example.com",
      city: "Curitiba",
      neighborhood: "Batel",
    });
    await submitTriage(page);

    const text = decodeWaText(await readOpenedWaUrl(page));
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Bairro: Batel");
  });

  test("debug de payload não aparece no fluxo de build/produção", async ({ page }) => {
    await page.goto("/triagem-preview");
    await completeConsoleTriage(page);
    await expect(page.getByText(/Ver payload de teste \(debug\)/i)).toHaveCount(0);
  });
});
