# AGENTS.md — precisodeumtecnico_2026

Instruções incrementais para referências visuais. Consultar antes o README e os contratos locais.

## Adoção controlada de referências visuais (17/11/2026)

- **TasteSkill** (https://www.tasteskill.dev/): adotar método de direção visual, originalidade, tipografia e revisão responsiva; não importar um template universal.
- **Transitions.dev** (https://transitions.dev/): preferir CSS para microtransições com propósito; respeitar `prefers-reduced-motion`, foco visível, teclado e touch.
- **React Bits** (https://reactbits.dev/): reutilizar componente gratuito apenas se compatível, sob análise MIT + Commons Clause, dependências, LCP e hidratação; sem Pro sem licença.
- **RiseClub** (https://riseclub.tech/): observar ideias de comunidade, cursos e notícias; produzir conteúdo original, nunca copiar marca, interface, imagens ou base de usuários.
- Escopo: Portal de serviços técnicos: aprimorar filtros, CTA e jornada de solicitação, sem afetar preços, consentimento, rotas, funil e indexação.
- Implementar mudanças funcionais só em PRs pequenas com gates existentes, QA em 390/1440 quando houver UI e fallback sem animação. Preservar SEO, privacidade, dados, integrações e produção.
- Não instalar CLIs, skills, pacotes externos ou serviços pagos de forma automática. Regras existentes do projeto têm precedência.

## Seleção contextual de skills compartilhadas (20/11/2026)

Este repositório participa do repertório de métodos de desenvolvimento reutilizáveis; seus contratos locais, regras de dados, identidade e gates sempre prevalecem. **Usar todas as competências pertinentes**, não instalar todas as ferramentas nem introduzir efeitos gratuitos.
- **Reanimate** (https://github.com/NiazMorshed2007/reanimate): adaptar apenas o método de engenharia de motion — observar estados/tempo/easing, criar solução autoral com CSS/WAAPI ou lib já existente, comparar capturas; não baixar, executar ou incorporar runtime de terceiros.
- **Gists públicos de QA**: diagnosticar oclusão mobile/CTA com https://gist.github.com/tobiashochguertel/bf7bc60f8946c7ecbe0d14782b4a8c99 e planejar capturas 390/1440 com https://gist.github.com/michael-matias-2026/d80389dfa08f4db9c5cc6020adf911ce ; são referências, não código para copiar/executar sem licença e revisão.
- **Playwright/a11y**: testar teclado, foco, touch, `prefers-reduced-motion`, overflow, loading/erro e desempenho somente quando pertinentes, preferindo os testes existentes. Adoção de SQL/RLS requer autorização separada e apenas hipóteses verificadas contra PostgreSQL oficial; nunca executar SQL de Gists em produção.
- **Foco local:** busca por serviço/cidade, filtros, solicitações e prova factual de cobertura. Reutilizar Playwright/Framer Motion já presentes; preservar consentimento, preços, SEO, sitemap, funil e dados reais.
- Em cada micro-PR registrar `USE/ADAPT/REJECT/NOT_APPLICABLE`, custo, risco, licença, evidências e gates efetivamente executados. Sem mudança de banco, dados, DNS, segurança, funis ou produção; sem Lovable Max ou instaladores externos automáticos.
