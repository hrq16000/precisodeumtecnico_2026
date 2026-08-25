import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft, ChevronRight, Download, ExternalLink, Eye, FileVideo, Filter,
  Image as ImageIcon, Loader2, RefreshCw, ShieldCheck, X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditRow {
  id: string;
  session_id: string;
  object_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  ip_address: string | null;
  user_agent: string | null;
  lead_id: string | null;
  created_at: string;
}

const BUCKET = "triage-media";
type MediaType = "all" | "image" | "video";

function humanSize(b: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function toCsv(rows: AuditRow[]): string {
  const headers = [
    "id", "created_at", "session_id", "lead_id", "mime_type",
    "size_bytes", "ip_address", "object_path", "user_agent",
  ];
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => esc((r as unknown as Record<string, unknown>)[h])).join(","));
  }
  return lines.join("\n");
}

const PAGE_SIZE = 25;

export function TriageMediaAuditLog() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<{ url: string; isVideo: boolean } | null>(null);
  const { toast } = useToast();

  // Filters
  const [leadFilter, setLeadFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("triage_media_uploads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (leadFilter.trim()) q = q.ilike("lead_id", `${leadFilter.trim()}%`);
    if (sessionFilter.trim()) q = q.ilike("session_id", `${sessionFilter.trim()}%`);
    if (typeFilter === "image") q = q.ilike("mime_type", "image/%");
    if (typeFilter === "video") q = q.ilike("mime_type", "video/%");
    if (fromDate) q = q.gte("created_at", new Date(fromDate).toISOString());
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      q = q.lte("created_at", end.toISOString());
    }

    const { data, error, count } = await q;
    if (error) {
      toast({ variant: "destructive", title: "Falha ao carregar auditoria", description: error.message });
    } else {
      setRows((data || []) as AuditRow[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  const applyFilters = () => { setPage(0); setTimeout(load, 0); };

  const clearFilters = () => {
    setLeadFilter(""); setSessionFilter(""); setTypeFilter("all");
    setFromDate(""); setToDate(""); setPage(0);
    setTimeout(load, 0);
  };

  const preview = async (path: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
    if (error || !data?.signedUrl) {
      toast({ variant: "destructive", title: "Falha ao gerar preview", description: error?.message ?? "" });
      return;
    }
    setPreviewUrl({ url: data.signedUrl, isVideo: /\.(mp4|mov|webm|m4v)$/i.test(path) });
  };

  const exportCsv = () => {
    if (rows.length === 0) {
      toast({ title: "Nada para exportar", description: "Filtro atual não retornou linhas." });
      return;
    }
    const csv = toCsv(rows);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `triage-media-audit-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado", description: `${rows.length} linha(s).` });
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const totalSize = rows.reduce((s, r) => s + (r.size_bytes ?? 0), 0);
    return { total, totalSize };
  }, [rows]);

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-3">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Auditoria de mídias de triagem
            <Badge variant="outline" className="ml-2">{total} total</Badge>
            <span className="text-xs text-muted-foreground font-normal ml-1">
              (página: {humanSize(stats.totalSize)})
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={loading || rows.length === 0}>
              <Download className="h-3 w-3 mr-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1"><Filter className="h-3 w-3" />Lead ID</Label>
            <Input
              placeholder="prefixo do lead"
              value={leadFilter}
              onChange={(e) => setLeadFilter(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sessão</Label>
            <Input
              placeholder="prefixo da sessão"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as MediaType)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="image">Imagens</SelectItem>
                <SelectItem value="video">Vídeos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">De</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Até</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 text-xs" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={applyFilters} disabled={loading}>Aplicar filtros</Button>
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma mídia para os filtros atuais.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Sessão</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-right">Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const isVideo = r.mime_type?.startsWith("video/");
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(r.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.session_id.slice(0, 8)}…</TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.lead_id ? `${r.lead_id.slice(0, 8)}…` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          {isVideo ? <FileVideo className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                          {r.mime_type ?? "?"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{humanSize(r.size_bytes)}</TableCell>
                      <TableCell className="text-xs">{r.ip_address ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => preview(r.object_path)}>
                            <Eye className="h-3 w-3 mr-1" /> Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!r.session_id && !r.lead_id}
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("admin:open-lead-by-session", {
                                  detail: { sessionId: r.session_id, leadId: r.lead_id },
                                }),
                              )
                            }
                            title="Abrir lead relacionado"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" /> Lead
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Página {page + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))} · {total} registros</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline"
              disabled={loading || (page + 1) * PAGE_SIZE >= total}
              onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {previewUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <div className="max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {previewUrl.isVideo ? (
                <video src={previewUrl.url} controls className="max-h-[90vh] rounded-sm" />
              ) : (
                <img src={previewUrl.url} alt="Mídia de triagem" className="max-h-[90vh] rounded-sm" />
              )}
              <Button className="mt-3" variant="secondary" onClick={() => setPreviewUrl(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
