import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Helmet } from "@/lib/helmet-compat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  ShieldCheck,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TriageMediaAuditLog } from "@/components/admin/TriageMediaAuditLog";
import { TriageFailuresLog } from "@/components/admin/TriageFailuresLog";
import { WABypassLog } from "@/components/admin/WABypassLog";
import { AdminBypassSummary } from "@/components/admin/AdminBypassSummary";
import { WAClicksDashboard } from "@/components/admin/WAClicksDashboard";
import { ReviewsModeration } from "@/components/admin/ReviewsModeration";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string | null;
  city: string | null;
  neighborhood: string | null;
  message: string | null;
  status: string;
  created_at: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  symptom: string | null;
  symptom_slug: string | null;
  service_mode: string | null;
  estimated_ticket_min: number | null;
  estimated_ticket_max: number | null;
  sla_days_min: number | null;
  sla_days_max: number | null;
  media_urls: string[] | null;
  triage_payload: any;
  triage_completed: boolean | null;
  terms_accepted: boolean | null;
  terms_accepted_at: string | null;
  source: string | null;
}

const BUCKET = "triage-media";

function formatTicket(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max && min !== max) return `R$ ${min} – R$ ${max}`;
  return `R$ ${min ?? max}`;
}

function formatSla(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max && min !== max) return `${min}–${max} dias`;
  return `${min ?? max} dias`;
}

const CSV_COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "created_at", label: "Data" },
  { key: "name", label: "Nome" },
  { key: "phone", label: "Telefone" },
  { key: "email", label: "Email" },
  { key: "city", label: "Cidade" },
  { key: "neighborhood", label: "Bairro" },
  { key: "category", label: "Categoria" },
  { key: "brand", label: "Marca" },
  { key: "model", label: "Modelo" },
  { key: "symptom", label: "Sintoma" },
  { key: "service", label: "Servico" },
  { key: "service_mode", label: "Modo" },
  { key: "estimated_ticket_min", label: "Ticket min" },
  { key: "estimated_ticket_max", label: "Ticket max" },
  { key: "sla_days_min", label: "SLA min" },
  { key: "sla_days_max", label: "SLA max" },
  { key: "triage_completed", label: "Triagem" },
  { key: "terms_accepted", label: "Aceite" },
  { key: "source", label: "Origem" },
  { key: "status", label: "Status" },
];

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  // Prefix formula-like values to avoid CSV injection in spreadsheet apps.
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function buildLeadsCsv(rows: Lead[]) {
  const header = CSV_COLUMNS.map((c) => csvCell(c.label)).join(";");
  const body = rows.map((row) => CSV_COLUMNS.map((c) => csvCell(row[c.key])).join(";"));
  return [header, ...body].join("\r\n");
}

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [signedMedia, setSignedMedia] = useState<{ url: string; path: string; isVideo: boolean }[]>([]);
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchLeads();
  }, [user, isAdmin]);

  // Permite outras seções do admin (audit log, falhas) abrirem o lead correspondente.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ sessionId?: string | null; leadId?: string | null }>;
      const { sessionId, leadId } = ce.detail || {};
      const match = leads.find((l) => {
        if (leadId && l.id === leadId) return true;
        const sid = (l.triage_payload as { sessionId?: string } | null)?.sessionId;
        return sessionId && sid === sessionId;
      });
      if (match) {
        openLead(match);
      } else {
        toast({
          variant: "destructive",
          title: "Lead não encontrado",
          description: sessionId ? `Sessão ${sessionId.slice(0, 10)}…` : "Sem vínculo.",
        });
      }
    };
    window.addEventListener("admin:open-lead-by-session", onOpen);
    return () => window.removeEventListener("admin:open-lead-by-session", onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Erro ao carregar leads", description: error.message });
    } else {
      setLeads((data || []) as Lead[]);
    }
    setLoading(false);
  };

  const filteredLeads = useMemo(() => {
    let f = leads;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(
        (l) =>
          l.name?.toLowerCase().includes(t) ||
          l.email?.toLowerCase().includes(t) ||
          l.phone?.includes(t) ||
          l.city?.toLowerCase().includes(t) ||
          l.symptom?.toLowerCase().includes(t)
      );
    }
    if (statusFilter !== "all") f = f.filter((l) => l.status === statusFilter);
    if (sourceFilter === "triage") f = f.filter((l) => l.triage_completed);
    if (sourceFilter === "legacy") f = f.filter((l) => !l.triage_completed);
    return f;
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) toast({ variant: "destructive", title: "Erro", description: error.message });
    else { toast({ title: "Status atualizado" }); fetchLeads(); }
  };

  const exportCsv = () => {
    const csv = buildLeadsCsv(filteredLeads);
    // BOM keeps accents readable in Excel pt-BR.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado", description: `${filteredLeads.length} lead(s)` });
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Excluir este lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast({ variant: "destructive", title: "Erro", description: error.message });
    else { toast({ title: "Lead excluído" }); fetchLeads(); }
  };

  const openLead = async (lead: Lead) => {
    setSelected(lead);
    setSignedMedia([]);
    const paths = (lead.media_urls || []).filter(Boolean);
    if (!paths.length) return;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao gerar mídias", description: error.message });
      return;
    }
    setSignedMedia(
      (data || []).map((d, i) => ({
        url: d.signedUrl ?? "",
        path: paths[i],
        isVideo: /\.(mp4|mov|webm|m4v)$/i.test(paths[i]),
      }))
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge variant="default">Novo</Badge>;
      case "contacted": return <Badge variant="secondary">Contactado</Badge>;
      case "scheduled": return <Badge className="bg-amber-500">Agendado</Badge>;
      case "converted": return <Badge className="bg-green-500">Convertido</Badge>;
      case "lost": return <Badge variant="destructive">Perdido</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    triage: leads.filter((l) => l.triage_completed).length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel de Leads</h1>
            <p className="text-muted-foreground">Triagem, mídias e aceites em um só lugar</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle></CardHeader>
            <CardContent><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><span className="text-2xl font-bold">{stats.total}</span></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Novos</CardTitle></CardHeader>
            <CardContent><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">{stats.new}</span></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Via Triagem</CardTitle></CardHeader>
            <CardContent><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500" /><span className="text-2xl font-bold">{stats.triage}</span></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Convertidos</CardTitle></CardHeader>
            <CardContent><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-2xl font-bold">{stats.converted}</span></div></CardContent></Card>
        </div>

        <ReviewsModeration />
        <AdminBypassSummary />
        <WAClicksDashboard />
        <WABypassLog />
        <TriageMediaAuditLog />
        <TriageFailuresLog />




        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, email, telefone, cidade ou sintoma..." className="pl-10"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="contacted">Contactados</SelectItem>
              <SelectItem value="scheduled">Agendados</SelectItem>
              <SelectItem value="converted">Convertidos</SelectItem>
              <SelectItem value="lost">Perdidos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Origem" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas origens</SelectItem>
              <SelectItem value="triage">Apenas Triagem</SelectItem>
              <SelectItem value="legacy">Formulários antigos</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchLeads}>
            <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={filteredLeads.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Exportar CSV
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Categoria / Sintoma</TableHead>
                    <TableHead>Modo</TableHead>
                    <TableHead>Ticket / SLA</TableHead>
                    <TableHead>Mídia</TableHead>
                    <TableHead>Aceite</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">Nenhum lead encontrado</TableCell></TableRow>
                  ) : (
                    filteredLeads.map((lead) => {
                      const mediaCount = (lead.media_urls || []).length;
                      const ticket = formatTicket(lead.estimated_ticket_min, lead.estimated_ticket_max);
                      const sla = formatSla(lead.sla_days_min, lead.sla_days_max);
                      return (
                        <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/40">
                          <TableCell className="font-medium" onClick={() => openLead(lead)}>
                            <div className="flex items-center gap-2">
                              {lead.triage_completed && <Badge variant="outline" className="border-emerald-500 text-emerald-600 text-[10px]">TRIAGEM</Badge>}
                              {lead.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <a
                                data-wa-source="admin-lead"
                                data-service="contato com lead"
                                aria-label="Abrir conversa no WhatsApp com o lead"
                                href={`mailto:${lead.email}`} className="flex items-center gap-1 text-sm hover:text-primary"><Mail className="h-3 w-3" />{lead.email}</a>
                              <a
                                data-wa-source="admin-lead"
                                data-service="contato com lead"
                                aria-label="Abrir conversa no WhatsApp com o lead"
                                href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:text-primary"><Phone className="h-3 w-3" />{lead.phone}</a>
                            </div>
                          </TableCell>
                          <TableCell onClick={() => openLead(lead)}>
                            <div className="text-sm">
                              <div className="font-medium">{lead.category || lead.service || "-"}</div>
                              <div className="text-muted-foreground text-xs">{lead.symptom || lead.symptom_slug || "—"}</div>
                            </div>
                          </TableCell>
                          <TableCell onClick={() => openLead(lead)}>
                            {lead.service_mode ? (
                              <Badge variant={lead.service_mode === "visit" ? "default" : "secondary"} className="text-xs">
                                {lead.service_mode === "visit" ? "Visita R$ 99,99" : "Bancada R$ 99,99"}
                              </Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell onClick={() => openLead(lead)} className="text-xs">
                            <div>{ticket || "-"}</div>
                            <div className="text-muted-foreground">{sla || ""}</div>
                          </TableCell>
                          <TableCell onClick={() => openLead(lead)}>
                            {mediaCount > 0 ? (
                              <Badge variant="outline" className="gap-1"><ImageIcon className="h-3 w-3" />{mediaCount}</Badge>
                            ) : <span className="text-xs text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell onClick={() => openLead(lead)}>
                            {lead.terms_accepted ? (
                              <Badge className="bg-emerald-500 gap-1"><ShieldCheck className="h-3 w-3" />OK</Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1"><ShieldAlert className="h-3 w-3" />Não</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(lead.created_at), "dd/MM HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openLead(lead)}><Eye className="h-4 w-4" /></Button>
                              <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v)}>
                                <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">Novo</SelectItem>
                                  <SelectItem value="contacted">Contactado</SelectItem>
                                  <SelectItem value="scheduled">Agendado</SelectItem>
                                  <SelectItem value="converted">Convertido</SelectItem>
                                  <SelectItem value="lost">Perdido</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm" onClick={() => deleteLead(lead.id)} className="text-destructive hover:text-destructive"><XCircle className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selected.name}
                  {selected.triage_completed && <Badge variant="outline" className="border-emerald-500 text-emerald-600">TRIAGEM</Badge>}
                </SheetTitle>
                <SheetDescription>{format(new Date(selected.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <section className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-muted-foreground text-xs">E-mail</div><div>{selected.email}</div></div>
                  <div><div className="text-muted-foreground text-xs">WhatsApp</div><div>{selected.phone}</div></div>
                  <div><div className="text-muted-foreground text-xs">Cidade</div><div>{selected.city || "-"}</div></div>
                  <div><div className="text-muted-foreground text-xs">Bairro</div><div>{selected.neighborhood || "-"}</div></div>
                </section>

                <section className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Diagnóstico</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-muted-foreground text-xs">Categoria</div><div>{selected.category || "-"}</div></div>
                    <div><div className="text-muted-foreground text-xs">Marca / Modelo</div><div>{[selected.brand, selected.model].filter(Boolean).join(" ") || "-"}</div></div>
                    <div className="col-span-2"><div className="text-muted-foreground text-xs">Sintoma</div><div>{selected.symptom || selected.symptom_slug || "-"}</div></div>
                    <div><div className="text-muted-foreground text-xs">Modo</div><div>{selected.service_mode === "visit" ? "Visita técnica (R$ 99,99)" : selected.service_mode === "bench" ? "Bancada (R$ 99,99)" : "-"}</div></div>
                    <div><div className="text-muted-foreground text-xs">Ticket estimado</div><div>{formatTicket(selected.estimated_ticket_min, selected.estimated_ticket_max) || "-"}</div></div>
                    <div><div className="text-muted-foreground text-xs">SLA</div><div>{formatSla(selected.sla_days_min, selected.sla_days_max) || "-"}</div></div>
                    <div><div className="text-muted-foreground text-xs">Origem</div><div>{selected.source || "-"}</div></div>
                  </div>
                  {selected.message && (
                    <div className="mt-3"><div className="text-muted-foreground text-xs">Mensagem</div><div className="text-sm whitespace-pre-wrap">{selected.message}</div></div>
                  )}
                </section>

                <section className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Aceites</h3>
                  {selected.terms_accepted ? (
                    <Badge className="bg-emerald-500 gap-1"><ShieldCheck className="h-3 w-3" />Aceitou termos {selected.terms_accepted_at && `em ${format(new Date(selected.terms_accepted_at), "dd/MM HH:mm")}`}</Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1"><ShieldAlert className="h-3 w-3" />Sem aceite registrado</Badge>
                  )}
                  {selected.triage_payload?.acceptances && (
                    <div className="mt-3 grid grid-cols-1 gap-1 text-xs">
                      {Object.entries(selected.triage_payload.acceptances).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          {v ? <ShieldCheck className="h-3 w-3 text-emerald-500" /> : <ShieldAlert className="h-3 w-3 text-destructive" />}
                          <span className="text-muted-foreground">{k}:</span><span>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Mídias ({signedMedia.length})</h3>
                  {signedMedia.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem mídias anexadas.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {signedMedia.map((m) => (
                        <a key={m.path} href={m.url} target="_blank" rel="noopener noreferrer" className="block rounded-md overflow-hidden border bg-muted">
                          {m.isVideo ? (
                            <video src={m.url} controls className="w-full h-40 object-cover" />
                          ) : (
                            <img src={m.url} alt="Mídia enviada pelo cliente na triagem técnica" className="w-full h-40 object-cover" />
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </section>

                {selected.triage_payload && (
                  <section className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Payload completo</h3>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto max-h-80">{JSON.stringify(selected.triage_payload, null, 2)}</pre>
                  </section>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
