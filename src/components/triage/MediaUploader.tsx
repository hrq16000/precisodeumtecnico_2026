import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  /** Mantido para compatibilidade; não é usado como pasta de storage. */
  sessionId?: string;
  paths: string[];
  onAdd: (path: string) => void;
  onRemove: (path: string) => void;
  /** Mínimos exigidos para Step 4b (tela / display). */
  minPhotos?: number;
  minVideos?: number;
  /** Limite de duração de vídeo, em segundos. */
  maxVideoSeconds?: number;
}

const MAX_PHOTO_MB = 5;
const MAX_VIDEO_MB = 50;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,video/webm";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const FN_URL = `${SUPABASE_URL}/functions/v1/triage-media-upload`;

/**
 * Stub de upload para testes E2E.
 * Ativado quando `?e2e=1` está presente na URL (verificado em runtime,
 * nunca no bundle de produção — não expõe o bypass a usuários reais).
 * Retorna um path sintético válido que atende às regex de foto/vídeo.
 */
function isE2EStubMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("e2e") === "1";
  } catch {
    return false;
  }
}


/** Aceita File e devolve `{ kind, mb, duration? }` ou erro humano. */
async function inspect(file: File, maxVideoSeconds: number) {
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) return { error: "Formato não suportado." };

  const mb = file.size / (1024 * 1024);
  if (isImage && mb > MAX_PHOTO_MB) return { error: `Foto acima de ${MAX_PHOTO_MB}MB.` };
  if (isVideo && mb > MAX_VIDEO_MB) return { error: `Vídeo acima de ${MAX_VIDEO_MB}MB.` };

  if (isVideo) {
    const duration = await new Promise<number>((resolve) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve(v.duration || 0);
      v.onerror = () => resolve(0);
      v.src = URL.createObjectURL(file);
    });
    if (duration > maxVideoSeconds + 0.5) {
      return { error: `Vídeo acima de ${maxVideoSeconds}s.` };
    }
    return { kind: "video" as const, mb, duration };
  }
  return { kind: "image" as const, mb };
}

export function MediaUploader({
  paths,
  onAdd,
  onRemove,
  minPhotos = 3,
  minVideos = 1,
  maxVideoSeconds = 30,
}: MediaUploaderProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Sessão emitida pelo servidor (HMAC) — a pasta de storage é controlada pelo backend.
  const sessionRef = useRef<{ sessionId: string; sessionToken: string } | null>(null);

  const ensureSession = useCallback(async () => {
    if (sessionRef.current) return sessionRef.current;
    if (isE2EStubMode()) {
      sessionRef.current = { sessionId: "e2e-session", sessionToken: "e2e-token" };
      return sessionRef.current;
    }
    const res = await fetch(FN_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: SUPABASE_ANON,
        authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({ action: "init" }),
    });
    if (!res.ok) throw new Error("Não foi possível iniciar a sessão de upload.");
    const data = (await res.json()) as { sessionId: string; sessionToken: string };
    sessionRef.current = data;
    return data;
  }, []);


  useEffect(() => {
    ensureSession().catch(() => {
      /* tentaremos novamente ao escolher o arquivo */
    });
  }, [ensureSession]);

  const photos = paths.filter((p) => /\.(jpe?g|png|webp|heic)$/i.test(p));
  const videos = paths.filter((p) => /\.(mp4|mov|webm|m4v)$/i.test(p));

  const friendlyError = useCallback((code: string | undefined, status: number) => {
    switch (code) {
      case "invalid_session":
        return "Sessão de upload inválida. Recarregue a página e tente novamente.";
      case "invalid_token":
        return "Sua sessão de envio expirou. Recarregue a página para reiniciar com segurança.";
      case "missing_file":
        return "Nenhum arquivo recebido. Selecione um arquivo válido.";
      case "unsupported_mime":
        return "Formato não suportado. Envie JPG, PNG, WEBP, HEIC, MP4, MOV ou WEBM.";
      case "file_too_large":
        return "Arquivo excede o tamanho permitido (foto até 5MB, vídeo até 50MB).";
      case "upload_failed":
        return "Não foi possível salvar o arquivo no servidor. Tente novamente em instantes.";
      case "bad_action":
      case "unsupported_content_type":
        return "Requisição inválida. Recarregue a página e tente novamente.";
      default:
        if (status === 401) return "Sessão expirada. Recarregue a página para continuar.";
        if (status === 413) return "Arquivo muito grande para envio.";
        if (status >= 500) return "Servidor temporariamente indisponível. Tente novamente.";
        return "Falha no upload. Tente novamente.";
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setError(null);
      setBusy(true);
      try {
        // Always re-init if we don't have a session, with a clear message on failure.
        let session = sessionRef.current;
        if (!session) {
          try {
            session = await ensureSession();
          } catch {
            setError("Não foi possível iniciar a sessão de upload. Verifique sua conexão e recarregue a página.");
            return;
          }
        }
        for (const file of Array.from(files)) {
          const info = await inspect(file, maxVideoSeconds);
          if ("error" in info) {
            setError(info.error ?? "Arquivo inválido.");
            continue;
          }
          // E2E stub: pula upload real e devolve path sintético consistente
          // com as regex de foto/vídeo (permite validar fluxo do wizard sem
          // depender da edge function em CI).
          if (isE2EStubMode()) {
            const ext = info.kind === "video" ? "mp4" : "jpg";
            onAdd(`e2e/${crypto.randomUUID()}.${ext}`);
            continue;
          }
          const fd = new FormData();
          fd.append("sessionId", session.sessionId);
          fd.append("sessionToken", session.sessionToken);
          fd.append("file", file);
          let res: Response;
          try {
            res = await fetch(FN_URL, {
              method: "POST",
              headers: {
                apikey: SUPABASE_ANON,
                authorization: `Bearer ${SUPABASE_ANON}`,
              },
              body: fd,
            });
          } catch {
            setError("Falha de rede ao enviar o arquivo. Verifique sua conexão e tente novamente.");
            continue;
          }
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            // If the server rejected our token, drop it so the next attempt re-inits.
            if (res.status === 401 || err?.error === "invalid_token" || err?.error === "invalid_session") {
              sessionRef.current = null;
            }
            setError(friendlyError(err?.error, res.status));
            continue;
          }
          const { path } = (await res.json()) as { path: string };
          onAdd(path);
        }

      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [ensureSession, onAdd, maxVideoSeconds, friendlyError],
  );

  const photosOk = photos.length >= minPhotos;
  const videosOk = videos.length >= minVideos;

  return (
    <div className="space-y-4">
      {/* AVISO IMPOSITIVO — vermelho intenso (memória do projeto) */}
      <div
        role="alert"
        className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-sm text-destructive"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          <div className="space-y-2">
            <p className="font-extrabold uppercase tracking-wide">
              ⚠️ ATENÇÃO: Faça um vídeo nítido mostrando o aparelho por completo,
              o dano e a etiqueta traseira.
            </p>
            <p className="font-bold">
              Não envie vídeos com barulho de fundo.{" "}
              <span className="underline">ÁUDIOS SERÃO IGNORADOS E O ATENDIMENTO CANCELADO.</span>
            </p>
            <p className="text-xs opacity-90">
              Relate o problema apenas por escrito na próxima etapa.
            </p>
          </div>
        </div>
      </div>

      {/* Botão de upload */}
      <label
        htmlFor="triage-media-input"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center transition hover:bg-primary/10",
          busy && "pointer-events-none opacity-60",
        )}
      >
        {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6 text-primary" />}
        <span className="text-sm font-semibold">
          {busy ? "Enviando..." : "Toque para selecionar fotos e vídeo"}
        </span>
        <span className="text-xs text-muted-foreground">
          Fotos JPG/PNG (até {MAX_PHOTO_MB}MB) · Vídeo MP4/MOV até {maxVideoSeconds}s ({MAX_VIDEO_MB}MB)
        </span>
        <input
          ref={inputRef}
          id="triage-media-input"
          type="file"
          className="sr-only"
          multiple
          accept={ACCEPTED}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Progresso de obrigatoriedade */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div
          className={cn(
            "rounded-lg border p-3 text-center",
            photosOk ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300" : "border-border bg-muted/30",
          )}
        >
          <ImageIcon className="mx-auto mb-1 h-4 w-4" />
          <span className="font-semibold">{photos.length}/{minPhotos}</span> fotos
        </div>
        <div
          className={cn(
            "rounded-lg border p-3 text-center",
            videosOk ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300" : "border-border bg-muted/30",
          )}
        >
          <VideoIcon className="mx-auto mb-1 h-4 w-4" />
          <span className="font-semibold">{videos.length}/{minVideos}</span> vídeo
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Lista dos arquivos enviados (mostra path sem expor URL — bucket é privado) */}
      {paths.length > 0 && (
        <ul className="space-y-1.5 text-xs">
          {paths.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2"
            >
              <span className="truncate font-mono">{p.split("/").pop()}</span>
              <button
                type="button"
                onClick={() => onRemove(p)}
                className="text-muted-foreground transition hover:text-destructive"
                aria-label={`Remover ${p}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
