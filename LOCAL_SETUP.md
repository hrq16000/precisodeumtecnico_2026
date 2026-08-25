# Ambiente local (100% offline)

Guia para rodar o portal e o backend inteiramente na sua máquina, sem depender
do ambiente hospedado.

## Pré-requisitos

- [Bun](https://bun.sh) 1.x
- [Docker](https://docs.docker.com/get-docker/) em execução
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm i -g supabase`)

## 1. Dependências e variáveis

```bash
bun install
cp .env.example .env
```

## 2. Subir o backend local

```bash
bun run db:start        # supabase start (Postgres + Auth + Storage + Studio)
```

O CLI imprime `API URL`, `anon key` e `service_role key`. Copie esses valores
para o `.env` (`VITE_SUPABASE_*` e `SUPABASE_*`).

Comandos úteis:

```bash
bun run db:reset        # recria o banco aplicando migrations + seed.sql
bun run db:stop         # derruba os containers
bun run functions:serve # serve as edge functions legadas localmente
```

As migrations em `supabase/migrations/` são aplicadas automaticamente pelo
`db:start` / `db:reset`. Os dados de exemplo ficam em `supabase/seed.sql`.

## 3. Rodar a aplicação

```bash
bun run dev:local       # MOCK_EXTERNAL_APIS=true + vite dev
```

- `dev:local` mantém as integrações externas mockadas: Resend e CallMeBot
  apenas escrevem log no terminal, nada é enviado para a internet.
- Use `bun run dev` quando quiser exercitar os provedores reais (exige chaves
  válidas no `.env`).

App: http://localhost:8080 · Supabase Studio: http://127.0.0.1:54323

## 4. Conta administrativa local

O `supabase/seed.sql` cria leads e uma ordem de serviço de exemplo. Para
acessar `/admin`, crie um usuário pelo Studio (Authentication → Users) e
conceda o papel:

```sql
insert into public.user_roles (user_id, role)
values ('<uuid-do-usuario>', 'admin')
on conflict do nothing;
```

## 5. Gates de qualidade

```bash
bun run build           # inclui os gates de SEO, preços e atributos de CTA
bunx tsgo --noEmit      # tipagem estrita
bunx playwright test    # suíte E2E
```

## Solução de problemas

| Sintoma | Causa provável |
| --- | --- |
| `supabase start` falha | Docker parado ou portas 54321-54324 ocupadas |
| Login não funciona | `VITE_SUPABASE_*` apontando para o projeto remoto |
| Nenhum e-mail chega em dev | Esperado: `MOCK_EXTERNAL_APIS=true` |
| `/admin` redireciona | Falta a linha em `public.user_roles` |
