-- =============================================================================
-- Seed de desenvolvimento local (aplicado por `supabase db reset`).
-- Não é executado em produção: dados fictícios apenas para exercitar o /admin,
-- a consulta pública de OS e a moderação de avaliações.
-- =============================================================================

insert into public.leads
  (name, email, phone, service, city, neighborhood, status, category, brand, model,
   symptom, symptom_slug, service_mode, estimated_ticket_min, estimated_ticket_max,
   sla_days_min, sla_days_max, triage_completed, terms_accepted, terms_accepted_at, source)
values
  ('Ana Souza', 'ana.souza@example.com', '41999990001', 'Formatação de computador',
   'Curitiba', 'Batel', 'new', 'notebook', 'Dell', 'Inspiron 15',
   'Lentidão extrema', 'lentidao-extrema', 'bancada', 99.99, 249.90, 1, 3,
   true, true, now(), 'seed'),
  ('Bruno Lima', 'bruno.lima@example.com', '41999990002', 'Troca de tela',
   'Curitiba', 'Portão', 'contacted', 'notebook', 'Acer', 'Aspire 5',
   'Tela quebrada', 'tela-quebrada', 'coleta', 299.99, 899.90, 2, 5,
   true, true, now(), 'seed'),
  ('Carla Mendes', 'carla.mendes@example.com', '41999990003', 'Wi-Fi instável',
   'São José dos Pinhais', 'Centro', 'scheduled', 'rede', null, null,
   'Sinal cai constantemente', 'sinal-cai', 'visita', 99.99, 199.90, 1, 2,
   true, true, now(), 'seed'),
  ('Diego Alves', 'diego.alves@example.com', '41999990004', 'Manutenção preventiva',
   'Pinhais', 'Weissópolis', 'converted', 'desktop', 'Positivo', null,
   'Superaquecimento', 'superaquecimento', 'bancada', 99.99, 179.90, 1, 2,
   true, true, now(), 'seed')
on conflict do nothing;

insert into public.service_orders
  (protocol, customer_name, customer_phone, city, neighborhood, service, equipment,
   status, public_note, eta_date)
values
  ('PDT-2024-0001', 'Ana Souza', '41999990001', 'Curitiba', 'Batel',
   'Formatação de computador', 'Notebook Dell Inspiron 15', 'em_analise',
   'Equipamento recebido na bancada; diagnóstico em andamento.', current_date + 2),
  ('PDT-2024-0002', 'Bruno Lima', '41999990002', 'Curitiba', 'Portão',
   'Troca de tela', 'Notebook Acer Aspire 5', 'aguardando_peca',
   'Aguardando chegada da peça aprovada pelo cliente.', current_date + 5)
on conflict do nothing;

insert into public.reviews
  (name, city, neighborhood, service, protocol, rating, comment, publish_consent,
   status, source, page_path)
values
  ('Ana S.', 'Curitiba', 'Batel', 'Formatação de computador', 'PDT-2024-0001', 5,
   'Notebook voltou rápido e sem travamentos.', true, 'approved', 'seed', '/avaliacoes'),
  ('Bruno L.', 'Curitiba', 'Portão', 'Troca de tela', 'PDT-2024-0002', 4,
   'Peça demorou um pouco, mas o atendimento foi transparente.', true, 'pending',
   'seed', '/avaliacoes')
on conflict do nothing;
