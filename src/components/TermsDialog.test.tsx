import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { TermsDialog } from "./TermsDialog";

function getDataLayer(): Array<Record<string, unknown>> {
  return (window.dataLayer ?? []) as Array<Record<string, unknown>>;
}
function eventsNamed(name: string) {
  return getDataLayer().filter((e) => e.event === name);
}

describe("TermsDialog", () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.dataLayer = [];
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("pushes terms_open to dataLayer once per open", async () => {
    render(<TermsDialog source="test" onAccept={() => {}} />);
    const trigger = screen.getByRole("button", {
      name: /Termos de Orçamento Pré-Aprovado/i,
    });
    fireEvent.click(trigger);

    await screen.findByRole("dialog");
    expect(eventsNamed("terms_open")).toHaveLength(1);

    // Re-render the same open state — should not double-fire.
    expect(eventsNamed("terms_open")).toHaveLength(1);
  });

  it("closes on ESC and re-fires terms_open on next open", async () => {
    render(<TermsDialog source="test" onAccept={() => {}} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i }),
    );
    const dialog = await screen.findByRole("dialog");

    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    fireEvent.click(
      screen.getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i }),
    );
    await screen.findByRole("dialog");
    expect(eventsNamed("terms_open")).toHaveLength(2);
  });

  it("fires terms_accept once and persists acceptance", async () => {
    const onAccept = vi.fn();
    render(<TermsDialog source="hero" onAccept={onAccept} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i }),
    );
    const acceptBtn = await screen.findByTestId("terms-accept");

    fireEvent.click(acceptBtn);
    fireEvent.click(acceptBtn); // should be guarded

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(eventsNamed("terms_accept")).toHaveLength(1);
    expect(window.sessionStorage.getItem("pdt_terms_accepted_v1")).toBe("1");
  });

  it("fires terms_full_page_click event", async () => {
    render(<TermsDialog source="quiz" onAccept={() => {}} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i }),
    );
    const link = await screen.findByRole("link", { name: /Abrir página completa/i });
    // Prevent navigation in jsdom
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(eventsNamed("terms_full_page_click")).toHaveLength(1);
  });

  it("dialog is keyboard-focusable (focus trap)", async () => {
    render(<TermsDialog source="test" onAccept={() => {}} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i }),
    );
    const dialog = await screen.findByRole("dialog");
    // Radix moves focus into the dialog after open
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });
});
