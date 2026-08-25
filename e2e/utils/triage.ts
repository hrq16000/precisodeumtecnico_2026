import { expect, type Page } from "@playwright/test";

/**
 * Helpers compartilhados para dirigir o wizard de triagem V2 no Playwright.
 * O wizard tem 7 etapas com auto-advance (500ms) em algumas delas, então toda
 * navegação é confirmada pelo indicador "Etapa X/7" do rodapé antes de seguir.
 */

export const TRIAGE_STEPS = 7;
const STEP_TIMEOUT = 20_000;

export interface TriageContact {
  name: string;
  phone: string;
  email: string;
  city?: string;
  neighborhood: string;
}

/** Bloqueia rede externa e escritas do funil (Supabase/edge/geo IP). */
export async function mockTriageWrites(page: Page) {
  await page.route("https://ipwho.is/**", (r) => r.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/**", (r) => r.fulfill({ status: 503, body: "{}" }));
  for (const path of ["leads", "terms_acceptances", "wa_bypass_events"]) {
    await page.route(`**/rest/v1/${path}**`, (r) =>
      r.fulfill({ status: 201, contentType: "application/json", body: "[]" }),
    );
  }
  await page.route("**/functions/v1/**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
}

/** Intercepta window.open e guarda as URLs em window.__WA_OPENED__. */
export async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __WA_OPENED__?: string[]; open: typeof window.open };
    w.__WA_OPENED__ = [];
    w.open = ((url?: string | URL) => {
      if (url) w.__WA_OPENED__!.push(String(url));
      return { closed: false, focus() {}, close() {} } as unknown as Window;
    }) as typeof window.open;
  });
}

export async function readOpenedWaUrl(page: Page): Promise<string> {
  await expect
    .poll(
      () =>
        page.evaluate(
          () => ((window as unknown as { __WA_OPENED__?: string[] }).__WA_OPENED__ ?? []).length,
        ),
      { timeout: STEP_TIMEOUT },
    )
    .toBeGreaterThan(0);
  const urls = await page.evaluate(
    () => (window as unknown as { __WA_OPENED__?: string[] }).__WA_OPENED__ ?? [],
  );
  return urls.find((u) => u.includes("wa.me/")) ?? urls[0];
}

export function decodeWaText(href: string): string {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

/** Marca o prompt de localização como já exibido (evita overlay no wizard). */
export async function suppressLocationPrompt(page: Page) {
  await page.addInitScript(() => {
    try { window.sessionStorage.setItem("user_location_prompted_v2", "1"); } catch { /* noop */ }
  });
}

/** Fecha o diálogo de localização caso ele já esteja aberto. */
export async function dismissLocationPrompt(page: Page) {
  const dialog = page.getByTestId("smart-location-dialog");
  if (await dialog.count()) {
    const later = dialog.getByRole("button", { name: "Agora não" });
    if (await later.isVisible().catch(() => false)) {
      await later.click();
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    }
  }
}

/** Aguarda o wizard estar na etapa informada (1-indexed). */
export async function waitForStep(page: Page, step: number) {
  await expect(page.getByText(`Etapa ${step}/${TRIAGE_STEPS}`)).toBeVisible({ timeout: STEP_TIMEOUT });
}


/** Clica em "Continuar" (rodapé) e aguarda a próxima etapa. */
export async function clickContinue(page: Page, nextStep: number) {
  const next = page.getByRole("button", { name: "Próxima etapa" });
  await expect(next).toBeEnabled({ timeout: STEP_TIMEOUT });
  await next.click();
  await waitForStep(page, nextStep);
}

/** Seleciona um radio pelo rótulo exato dentro do wizard. */
export async function selectRadio(page: Page, label: string | RegExp) {
  const radio = page.getByRole("radio", { name: label }).first();
  await expect(radio).toBeVisible({ timeout: STEP_TIMEOUT });
  await radio.click();
  await expect(radio).toHaveAttribute("aria-checked", "true");
}

/** Marca todos os checkboxes visíveis da etapa (usado na etapa 6 — Termos). */
export async function acceptAllTerms(page: Page) {
  await waitForStep(page, 6);
  const boxes = page.getByRole("checkbox");
  await expect.poll(() => boxes.count(), { timeout: STEP_TIMEOUT }).toBeGreaterThan(0);
  const total = await boxes.count();
  for (let i = 0; i < total; i += 1) {
    const box = boxes.nth(i);
    if (!(await box.isVisible())) continue;
    if ((await box.getAttribute("aria-checked")) === "true") continue;
    await box.click();
    await expect(box).toHaveAttribute("aria-checked", "true", { timeout: 5_000 });
  }
  await clickContinue(page, 7);
}

/** Preenche os contatos obrigatórios da etapa 7. */
export async function fillContactStep(page: Page, contact: TriageContact) {
  await waitForStep(page, 7);
  await page.locator("#triage-field-name").fill(contact.name);
  await page.locator("#triage-field-phone").fill(contact.phone);
  await page.locator("#triage-field-email").fill(contact.email);
  if (contact.city !== undefined) await page.locator("#triage-field-city").fill(contact.city);
  await page.locator("#triage-field-neighborhood").fill(contact.neighborhood);
}

export async function submitTriage(page: Page) {
  const submit = page.getByRole("button", { name: /Agendar agora/i });
  await expect(submit).toBeEnabled({ timeout: STEP_TIMEOUT });
  await submit.click();
}

const DEFAULT_CONTACT: TriageContact = {
  name: "Cliente Teste",
  phone: "(41) 99999-0000",
  email: "cliente@example.com",
  neighborhood: "Batel",
};

/**
 * Percorre a jornada completa do equipamento "Videogame" (7 etapas),
 * incluindo a etapa 6 (Termos), e envia a triagem.
 */
export async function completeConsoleTriage(
  page: Page,
  opts: { symptom?: string | RegExp; contact?: Partial<TriageContact>; submit?: boolean } = {},
) {
  const contact = { ...DEFAULT_CONTACT, ...(opts.contact ?? {}) };
  const symptom = opts.symptom ?? "Não lê disco";

  // Etapa 1 — equipamento (auto-advance).
  await dismissLocationPrompt(page);
  await waitForStep(page, 1);

  // O primeiro clique pode cair antes da hidratação (SSR): re-tenta até a
  // etapa realmente avançar.
  const equipmentBtn = page.getByRole("button", { name: /^Videogame/ }).first();
  await expect(equipmentBtn).toBeVisible({ timeout: STEP_TIMEOUT });
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await equipmentBtn.click();
    const advanced = await page
      .getByText(`Etapa 2/${TRIAGE_STEPS}`)
      .waitFor({ state: "visible", timeout: 4_000 })
      .then(() => true)
      .catch(() => false);
    if (advanced) break;
  }
  await waitForStep(page, 2);


  // Etapa 2 — identificação (auto-advance quando o campo obrigatório é válido).
  await page.locator("#triage-field-console_model").fill("PS5");
  await waitForStep(page, 3);

  // Etapa 3 — sintoma (auto-advance).
  await selectRadio(page, symptom);
  await waitForStep(page, 4);

  // Etapa 4 — detalhes + urgência (auto-advance após urgência).
  const groups = page.getByRole("radiogroup");
  const groupCount = await groups.count();
  for (let g = 0; g < groupCount; g += 1) {
    const group = groups.nth(g);
    if (!(await group.isVisible())) continue;
    if (await group.locator('[aria-checked="true"]').count()) continue;
    const radios = group.getByRole("radio");
    if (await radios.count()) await radios.first().click();
  }
  await waitForStep(page, 5);

  // Etapa 5 — modalidade (confirmação manual).
  await clickContinue(page, 6);

  // Etapa 6 — termos.
  await acceptAllTerms(page);

  // Etapa 7 — contato e envio.
  await fillContactStep(page, contact);
  if (opts.submit !== false) await submitTriage(page);
}

/**
 * Simula popup bloqueado pelo navegador: window.open passa a retornar null
 * mas ainda registra a URL solicitada, permitindo comparar o deep-link do
 * fallback com o que teria sido aberto.
 */
export async function blockPopups(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __WA_OPENED__?: string[]; open: typeof window.open };
    w.__WA_OPENED__ = [];
    w.open = ((url?: string | URL) => {
      if (url) w.__WA_OPENED__!.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

/** Emula rede lenta (perfil ~Slow 3G) via CDP no Chromium. */
export async function emulateSlowNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8,
  });
  return client;
}
