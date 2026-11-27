import { test, expect, type Page } from "@playwright/test";

/**
 * Gate de qualidade visual: detecta quebras de layout em rotas críticas.
 *
 * Verifica, em mobile e desktop:
 *  - ausência de scroll horizontal na página;
 *  - nenhum elemento visível estourando a largura do viewport;
 *  - nenhum texto cortado (conteúdo com overflow oculto e clipping real).
 */

const ROUTES = [
  "/",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/areas-atendidas",
  "/atendimento-urgente",
  "/area-de-atendimento-curitiba",
  "/checklists-de-reparo",
  "/como-funciona",
  "/anuncie",
  "/faq",
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 900 },
];

// Tolerância em px para arredondamento de layout/sub-pixel.
const TOLERANCE = 2;

async function collectOverflow(page: Page, viewportWidth: number) {
  return page.evaluate(
    ({ viewportWidth, TOLERANCE }) => {
      const offenders: { selector: string; right: number; text: string }[] = [];
      const clipped: { selector: string; text: string }[] = [];

      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : "";
        const cls = typeof el.className === "string" && el.className
          ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
          : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      };

      // Elementos contidos por um ancestral que recorta/rola no eixo X
      // (tabelas com overflow-x-auto, blobs decorativos em overflow-hidden)
      // não são quebra de layout — são recorte intencional.
      const isContainedByClippingAncestor = (el: Element) => {
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          const ov = getComputedStyle(parent).overflowX;
          if (ov === "hidden" || ov === "auto" || ov === "scroll" || ov === "clip") return true;
          parent = parent.parentElement;
        }
        return false;
      };

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
        if (style.position === "fixed") continue;
        // Elementos acessíveis mas visualmente ocultos (sr-only, skip-link)
        // usam clip/1px de propósito — não são quebra de layout.
        if (style.clip !== "auto" || style.clipPath !== "none") continue;

        const rect = el.getBoundingClientRect();
        if (rect.width <= 4 || rect.height <= 4) continue;
        if (rect.right < 0 || rect.bottom < 0) continue;


        if (rect.right > viewportWidth + TOLERANCE && !isContainedByClippingAncestor(el)) {
          offenders.push({
            selector: describe(el),
            right: Math.round(rect.right),
            text: (el.textContent || "").trim().slice(0, 60),
          });
        }

        // Texto cortado: overflow hidden sem ellipsis e conteúdo maior que a caixa.
        const hasText = el.children.length === 0 && (el.textContent || "").trim().length > 0;
        if (
          hasText &&
          style.overflowY === "hidden" &&
          style.textOverflow !== "ellipsis" &&
          (style as CSSStyleDeclaration & { webkitLineClamp?: string }).webkitLineClamp === "none" &&
          el.scrollHeight - el.clientHeight > 8
        ) {
          clipped.push({ selector: describe(el), text: (el.textContent || "").trim().slice(0, 60) });
        }
      }


      return {
        offenders: offenders.slice(0, 10),
        clipped: clipped.slice(0, 10),
        docScrollWidth: document.documentElement.scrollWidth,
      };
    },
    { viewportWidth, TOLERANCE },
  );
}

for (const viewport of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`layout íntegro em ${route} (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);

      const result = await collectOverflow(page, viewport.width);

      expect(
        result.offenders,
        `Elementos estourando a largura em ${route} (${viewport.name}): ${JSON.stringify(result.offenders)}`,
      ).toEqual([]);

      expect(
        result.docScrollWidth,
        `Scroll horizontal em ${route} (${viewport.name})`,
      ).toBeLessThanOrEqual(viewport.width + TOLERANCE);

      expect(
        result.clipped,
        `Texto cortado em ${route} (${viewport.name}): ${JSON.stringify(result.clipped)}`,
      ).toEqual([]);
    });
  }
}

// Detect a squeezed page shell even when it does not cause horizontal overflow.
for (const width of [390, 600, 768, 900, 1024, 1440, 1600]) {
  test(`fluid shared shell at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?utm_source=qa&utm_medium=layout_test", { waitUntil: "domcontentloaded" });
    const measured = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.className = "container";
      document.body.appendChild(probe);
      const style = getComputedStyle(probe);
      const measured = { viewport: document.documentElement.clientWidth, width: probe.getBoundingClientRect().width, padding: parseFloat(style.paddingInlineStart) };
      probe.remove();
      return measured;
    });
    expect(measured.width).toBeCloseTo(Math.min(measured.viewport, 1400), 0);
    if (width === 390) expect(measured.padding).toBeLessThanOrEqual(16.5);
  });
}
