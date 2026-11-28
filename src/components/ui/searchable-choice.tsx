import { forwardRef, useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { normalizeChoice, rankChoices, type SearchChoice } from "@/lib/searchable-options";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "role" | "type"> {
  value: string;
  options: readonly SearchChoice[];
  onValueChange: (value: string) => void;
}

/** Editing is separate from selection: blur/Escape cancels the draft, and
 * only a deliberate choice changes commercial IDs, price or triage context. */
export const SearchableChoice = forwardRef<HTMLInputElement, Props>(function SearchableChoice(
  { value, options, onValueChange, id, className, disabled, onBlur, ...props }, ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = generatedId + "-options";
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const label = value ? options.find(option => option.value === value)?.label ?? "" : "";
  const results = rankChoices(options, editing ? query : "");
  const visible = open && !disabled;

  function close() {
    setOpen(false); setEditing(false); setActive(-1);
  }
  function commit(index: number) {
    const option = results[index];
    if (!option) return;
    if (option.value !== value) onValueChange(option.value);
    close();
  }
  useEffect(() => {
    if (visible && active >= 0) document.getElementById(listId + "-" + active)?.scrollIntoView?.({ block: "nearest", behavior: "auto" });
  }, [visible, active, listId]);

  return <div className="relative min-w-0">
    <div className="relative">
      <Input {...props} ref={ref} id={inputId} type="text" role="combobox" disabled={disabled}
        autoComplete="off" aria-autocomplete="list" aria-expanded={visible}
        aria-controls={visible ? listId : undefined}
        aria-activedescendant={visible && active >= 0 && active < results.length ? listId + "-" + active : undefined}
        data-searchable-choice="" data-choice-value={value}
        className={"min-h-11 pr-10 " + (className ?? "")}
        value={editing ? query : label}
        onFocus={event => { setOpen(true); setActive(-1); event.currentTarget.select(); }}
        onClick={() => setOpen(true)}
        onChange={event => { setQuery(event.target.value); setEditing(true); setOpen(true); setActive(-1); }}
        onBlur={event => { close(); onBlur?.(event); }}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            if (results.length) setActive(previous => event.key === "ArrowDown" ?
              (previous + 1) % results.length : previous < 0 ? results.length - 1 : (previous - 1 + results.length) % results.length);
          } else if (event.key === "Enter" && visible) {
            event.preventDefault();
            const exact = results.filter(option => normalizeChoice(option.label) === normalizeChoice(query));
            if (active >= 0 && active < results.length) commit(active);
            else if (editing && exact.length === 1) commit(results.indexOf(exact[0]!));
            else if (editing && results.length === 1) commit(0);
          } else if (event.key === "Escape" && visible) {
            event.preventDefault(); event.stopPropagation(); close();
          }
        }}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
    {visible && <div className="absolute inset-x-0 top-full z-30 mt-1 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
      <p className="px-3 pt-2 text-xs text-muted-foreground">Digite para pesquisar; confirme uma opção.</p>
      <div id={listId} role="listbox" aria-label="Sugestões" className="max-h-52 overflow-y-auto overscroll-contain p-1">
        {results.map((option, index) => <div key={option.value} id={listId + "-" + index}
          role="option" aria-selected={active === index || (active < 0 && value === option.value)}
          onMouseDown={event => event.preventDefault()} onClick={() => commit(index)}
          className={"flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm " + (active === index ? "bg-primary/10 text-primary" : "hover:bg-muted")}>
          <span className="min-w-0 break-words">{option.label}</span>
          {value === option.value && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
        </div>)}
      </div>
      {!results.length && <p role="status" className="px-3 pb-3 text-sm text-muted-foreground">Nenhuma opção encontrada. Tente outro termo.</p>}
    </div>}
  </div>;
});
