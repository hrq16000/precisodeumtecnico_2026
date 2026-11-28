import { describe, expect, it } from "vitest";
import { rankChoices } from "./searchable-options";

describe("Seleção inteligente universal", () => {
  const choices = [
    { value: "montagem-moveis", label: "Montador de Móveis", keywords: "guarda roupa" },
    { value: "pc_notebook", label: "PC / Notebook", keywords: "computador" },
    { value: "sao-jose", label: "São José dos Pinhais" },
    ...Array.from({ length: 120 }, (_, i) => ({ value: "id-" + i, label: "Serviço " + i })),
  ];
  it("encontra termos sem acentos e preserva o ID confirmado", () => {
    expect(rankChoices(choices, "SAO JOSE")[0]?.value).toBe("sao-jose");
    expect(rankChoices(choices, "moveis montador")[0]?.value).toBe("montagem-moveis");
    expect(rankChoices(choices, "computador")[0]?.value).toBe("pc_notebook");
    expect(rankChoices(choices, "servico 119")[0]?.value).toBe("id-119");
  });
  it("limita 120+ opções e nunca fabrica valores", () => {
    expect(rankChoices(choices, "")).toHaveLength(8);
    expect(rankChoices(choices, "servico")).toHaveLength(8);
    expect(rankChoices(choices, "inexistente")).toEqual([]);
  });
});
