import { test, expect, type Page } from "@playwright/test";

/**
 * FAQPage JSON-LD nas páginas CidadeNacional e BairroNacional.
 * Verificamos:
 *   - existe pelo menos um bloco JSON-LD com @type=FAQPage
 *   - possui mainEntity com perguntas/respostas não-vazias
 *   - o conteúdo muda de slug para slug (evita FAQ idêntica em N páginas)
 */

async function readFAQ(page: Page): Promise<{ questions: string[]; raw: string }> {
  return await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      try {
        const parsed = JSON.parse(s.textContent || "{}");
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const p of arr) {
          if (p?.["@type"] === "FAQPage" && Array.isArray(p.mainEntity)) {
            const questions = p.mainEntity
              .map((q: { name?: string }) => q?.name ?? "")
              .filter(Boolean);
            return { questions, raw: JSON.stringify(p) };
          }
        }
      } catch { /* skip */ }
    }
    return { questions: [], raw: "" };
  });
}

const CITY_A = "/atendimento-nacional/sao-paulo";
const CITY_B = "/atendimento-nacional/rio-de-janeiro";
const BAIRRO_A = "/atendimento-nacional/sao-paulo/pinheiros";
const BAIRRO_B = "/atendimento-nacional/sao-paulo/moema";

test("CidadeNacional renderiza FAQPage JSON-LD válido", async ({ page }) => {
  await page.goto(CITY_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const { questions, raw } = await readFAQ(page);
  expect(questions.length, "FAQPage deve ter perguntas").toBeGreaterThan(0);
  expect(raw).toContain("FAQPage");
  for (const q of questions) expect(q.trim().length).toBeGreaterThan(3);
});

test("BairroNacional renderiza FAQPage JSON-LD válido", async ({ page }) => {
  await page.goto(BAIRRO_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const { questions } = await readFAQ(page);
  expect(questions.length).toBeGreaterThan(0);
});

test("FAQPage muda entre cidades diferentes", async ({ page }) => {
  await page.goto(CITY_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const a = await readFAQ(page);

  await page.goto(CITY_B, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const b = await readFAQ(page);

  expect(a.questions.length).toBeGreaterThan(0);
  expect(b.questions.length).toBeGreaterThan(0);
  // Conteúdo localizado deve diferir (nome da cidade aparece nas respostas).
  expect(a.raw).not.toBe(b.raw);
});

test("FAQPage muda entre bairros da mesma cidade", async ({ page }) => {
  await page.goto(BAIRRO_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const a = await readFAQ(page);

  await page.goto(BAIRRO_B, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const b = await readFAQ(page);

  expect(a.raw).not.toBe(b.raw);
});


// Três URLs registradas no relatório de paridade de CI em 27/11.
for (const route of [
  "/servicos/configuracao-wifi/curitiba/centro",
  "/atendimento-nacional/recife/casa-forte",
  "/servico-em-nacional/rio-de-janeiro/copacabana/informatica",
]) {
  test(`FAQ SSR e paridade 1:1 — ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBe(true);
    expect(await response!.text()).toContain("data-faq-schema=");
    const faq = page.locator('script[type="application/ld+json"][data-faq-schema]');
    await expect(faq).toHaveCount(1);
    const data = await faq.evaluate((node) => JSON.parse(node.textContent || "{}") as {
      "@type": string;
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    });
    expect(data["@type"]).toBe("FAQPage");
    const questions = page.locator('[data-testid="faq-question"], [data-faq-question]');
    await expect(questions).toHaveCount(data.mainEntity.length);
    expect(data.mainEntity.length).toBeGreaterThan(0);
    const norm = (value: string) => value.replace(/\s+/g, " ").trim();
    for (let i = 0; i < data.mainEntity.length; i++) {
      const question = questions.nth(i);
      expect(norm((await question.textContent()) ?? "")).toBe(norm(data.mainEntity[i].name));
      const item = question.locator("xpath=ancestor::*[@data-faq-item][1]");
      const answer = item.locator("[data-faq-answer]");
      if (!(await answer.count()) || !(await answer.textContent())?.trim()) {
        await question.click();
      }
      await expect(answer).toHaveText(data.mainEntity[i].acceptedAnswer.text);
    }
    // Verifica que não houve duplicação por outro emissor após hidratação.
    const total = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes.flatMap((node) => {
        try {
          const value = JSON.parse(node.textContent ?? "{}");
          return Array.isArray(value) ? value : [value];
        } catch { return []; }
      }).filter((node) => node?.["@type"] === "FAQPage").length
    );
    expect(total).toBe(1);
  });
}
