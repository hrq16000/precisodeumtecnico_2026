export type SearchChoice = { value: string; label: string; keywords?: string };

export function normalizeChoice(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR")
    .replace(/[_/–—-]+/g, " ").trim().replace(/\s+/g, " ");
}

/** Search is advisory; only a confirmed option exposes its canonical value. */
export function rankChoices(options: readonly SearchChoice[], query: string, limit = 8): SearchChoice[] {
  const needle = normalizeChoice(query);
  if (!needle) return options.slice(0, limit);
  const tokens = needle.split(" ");
  return options.flatMap((option, index) => {
    const label = normalizeChoice(option.label);
    const value = normalizeChoice(option.value);
    const corpus = normalizeChoice([option.label, option.value, option.keywords].filter(Boolean).join(" "));
    if (!tokens.every(token => corpus.includes(token))) return [];
    const score = label === needle || value === needle ? 0 : label.startsWith(needle) ? 1
      : label.split(" ").some(word => word.startsWith(needle)) ? 2 : label.includes(needle) ? 3 : 4;
    return [{ option, index, score }];
  }).sort((a, b) => a.score - b.score || a.index - b.index).slice(0, limit).map(result => result.option);
}
