import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackCtaClick, trackWebVital } from "./analytics";

describe("trackCtaClick", () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  it("pushes cta_click with all standardized parameters", () => {
    trackCtaClick({
      surface: "footer",
      cta_id: "footer_service",
      label: "Informática",
      destination: "/servicos/informatica",
      service: "Informática",
    });
    const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const last = dl[dl.length - 1];
    expect(last.event).toBe("cta_click");
    expect(last.surface).toBe("footer");
    expect(last.cta_id).toBe("footer_service");
    expect(last.destination).toBe("/servicos/informatica");
    expect(last.service).toBe("Informática");
  });
});

describe("trackWebVital", () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  it("pushes web_vital with rounded-sm value", () => {
    trackWebVital({ name: "LCP", value: 1234.56, id: "v1-1", rating: "good" });
    const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const last = dl[dl.length - 1];
    expect(last.event).toBe("web_vital");
    expect(last.metric_name).toBe("LCP");
    expect(last.metric_value).toBe(1235);
    expect(last.metric_rating).toBe("good");
  });

  it("scales CLS value by 1000 for integer reporting", () => {
    trackWebVital({ name: "CLS", value: 0.0567, id: "v1-2", rating: "needs-improvement" });
    const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const last = dl[dl.length - 1];
    expect(last.metric_value).toBe(57);
  });
});
