/**
 * Comprovante em PDF da Ordem de Serviço.
 *
 * Contém o código rastreável, os dados da solicitação, os termos aceitos
 * (prazos, valores pré-aprovados e regras de segurança) e a mensagem
 * sintetizada. Regra global do portal: nunca inclui CNPJ, e-mail ou telefone.
 */
import type { OsRecord } from "@/lib/serviceOrderRecords";
import { OS_MODE_LABEL, statusLabel } from "@/lib/serviceOrderRecords";

const MARGIN = 14;
const WIDTH = 210;
const LINE = 5;

export async function downloadOsReceipt(record: OsRecord): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensurePage = (needed = LINE) => {
    if (y + needed > 285) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const write = (text: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, WIDTH - MARGIN * 2) as string[];
    for (const line of lines) {
      ensurePage();
      doc.text(line, MARGIN, y);
      y += size >= 14 ? LINE + 2 : LINE;
    }
  };

  const heading = (text: string) => {
    y += 3;
    ensurePage(10);
    write(text, 12, true);
  };

  write("Comprovante de Ordem de Serviço", 16, true);
  write("Preciso de Um Técnico — assistência técnica em Curitiba e região", 9);
  y += 2;

  write(`Código rastreável: ${record.protocol}`, 13, true);
  write(`Abertura: ${new Date(record.createdAt).toLocaleString("pt-BR")}`, 9);
  write(`Status atual: ${statusLabel(record.status)}`, 9);

  heading("Solicitação");
  write(`Cliente: ${record.name}`);
  write(`Equipamento: ${record.equipment}${record.brandModel ? ` — ${record.brandModel}` : ""}`);
  write(`Problema relatado: ${record.problem}`);
  write(`Modalidade: ${OS_MODE_LABEL[record.mode]}`);
  write(`Localidade: ${[record.neighborhood, record.city].filter(Boolean).join(", ")}`);
  if (record.reference) write(`Referência: ${record.reference}`);
  if (record.preferredWindow) write(`Preferência de horário: ${record.preferredWindow}`);

  heading("Termos aceitos pelo cliente");
  for (const group of record.terms) {
    write(group.title, 10, true);
    for (const item of group.items) write(`• ${item}`, 9);
    y += 1;
  }

  heading("Resumo enviado no atendimento");
  write(record.message.replace(/\*/g, ""), 9);

  y += 4;
  write(
    "Documento gerado automaticamente pelo portal para conferência do cliente. Consulte o andamento pelo código acima em precisodeumtecnico.com/consultar-os.",
    8,
  );

  doc.save(`${record.protocol}.pdf`);
}
