# Design engineering premium — análise e adoção Emil Kowalski

**Estado:** R0 + R1.2 — diagnóstico estático e auditoria visual desktop parcial; implementação NÃO iniciada.
**Data:** 27/11/2026 • **Repositório:** hrq16000/precisodeumtecnico_2026 • **Checkpoint analisado da main:** `f781f9f6f5c8192596fdae65cd89030253219b86`.

Este documento é incremental. As regras locais de AGENTS.md, DESIGN.md, segurança, SEO, arquitetura, publicação, dados e funis prevalecem. Não autoriza alterações de runtime, instalações, custos, merge ou deploy. Não substitui a homologação visual da versão efetivamente publicada. A auditoria ao vivo posterior (R1.2) está registrada na seção 7; não implica homologação da produção.

## 1. Diagnóstico por projeto (evidência de leitura)

- **Contexto:** Portal de triagem de serviços técnicos.
- **Observação concreta:** Home contém SmartSearchWidget, QuickDiagnosisQuiz, QuickQuoteForm e Reveal. src/components/Reveal.tsx:43 usa transition-all, duration-700 e will-change-transform.
- **Stack presente (package.json):** @tanstack/react-start 1.168.32, framer-motion ^12.40.0, react ^19.2.0, sonner ^2.0.7, tailwindcss ^4.2.1, vite 8.1.5, @playwright/test 1.56.0, vitest ^3.
- **Home/entrada observada:** src/routes/index.tsx, src/pages/Index.tsx.
- **CSS amostrado:** src/styles.css (15 @keyframes; 4 referências a prefers-reduced-motion; 5 ocorrências de transição ampla). Contagem textual de declarações, não prova de uso/renderização ou defeito.
- **Documentação local a preservar:** AGENTS.md/README.md e contratos relevantes; nenhum guia específico encontrado na seleção.
- **Oportunidade prioritária (hipótese a validar):** Reduzir reveal genérico quando usado em etapas frequentes; feedback imediato no formulário, progressão clara, lista de sintomas e estados de consentimento.
- **Limite local:** Não esconder conteúdo indexável, simular prova social, modificar preços ou redesenhar o fluxo em massa.

## 2. Fonte primária e repertório

Fonte verificada: [emilkowalski/skills — revisão 64eb3deb](https://github.com/emilkowalski/skills/tree/64eb3deb9a5fbfa041faf783e0bc3fd635872e9c). Consultar `SKILL.md` do módulo e, quando necessário, RECIPES/STANDARDS antes da implementação. Esta é uma síntese autoral de princípios adaptados à aplicação; não instala nem executa scripts externos.

| Módulo | Uso no próximo trabalho visual |
| --- | --- |
| emil-design-eng | Refinar origem, feedback, legibilidade e detalhes; calibrar critérios de gosto |
| find-animation-opportunities | Ler UI e código, inventariar oportunidades e rejeições sem editar |
| remove-animations | Subtrair loops/reveals e atrasos que não se justificam |
| improve-animations / review-animations | Auditar componentes existentes e propor ajustes isolados |
| animate / animation-vocabulary | Escolher propósito, curva, duração, propriedade, entrada/saída e vocabulário |
| choreograph | Definir lead, apoio, simultaneidade, interrupção e o que permanece imóvel |
| animation-performance | Medir paint, layout, custo JS, frames, camadas e regressões |
| mobile-native / gestures | Touch, safe areas, hover, teclado, swipe e controle interrompível |
| apple-design | Continuidade espacial e adaptação da interação, sem copiar interfaces |
| prototype | Comparar duas ou três composições em branch local, inclusive versão sem motion |
| break-ui | Testar dados extremos, vazio, erro, loading, nomes longos, zoom e viewport |
| learn-taste | Registrar decisões confirmadas e seus motivos em DESIGN.md ou documento equivalente |
| pick-ui-library / ask-emil / ask-sonner | Escolher mecanismo mínimo e reaproveitar componentes existentes; módulos específicos só quando necessários |

Módulos mobile nativos (animate-expo/write-swift) não são aplicáveis por padrão a uma aplicação web. Não atualizar dependências só para cumprir esta diretriz; validar licença, SSR, bundle e compatibilidade se houver necessidade real. Referências anteriores (TasteSkill, Transitions.dev, React Bits, GSAP/Lottie/3D) são complementares quando compatíveis, não justificativa de efeitos obrigatórios.

## 3. Experiência premium: direção de arte primeiro

- Escolher uma personalidade (tipografia, paleta, contraste, espaço, forma, fotos/mídia reais, ritmo e assinatura) derivada da marca e da intenção de cada página.
- Estruturar o primeiro viewport para explicar o benefício e ação primária; evitar padrões repetitivos de cards/gradientes, sombras pesadas, excesso de badges e composição indistinguível entre projetos.
- Usar hierarquia editorial, alinhamento, espaço negativo e elementos visuais específicos ao negócio. Fazer teste sem marcas: a composição ainda comunica a proposta? Não copiar layout, ativos, textos ou marcas de sites premiados.
- Uma experiência de campanha rara pode ter um momento assinado (ex.: revelação localizada, galeria ou transformação explicativa). Não impor uma quantidade de animações; a ausência de motion pode ser a decisão correta.
- Nas rotas transacionais, busca, listas e administração, privilegiar velocidade, foco e estabilidade. Conteúdo, CTA, preços, resultados, navegação e formulários devem funcionar sem movimento, e conteúdo público/SEO deve ficar disponível antes da hidratação quando aplicável.

## 4. Critério de decisão de motion

Toda proposta precisa declarar **superfície, propósito, frequência, propriedade, easing, duração, fallback e interrupção**. Rejeitar quando não houver utilidade ou quando a frequência tornar o movimento incômodo.

| Superfície | Escolha inicial (adaptar tokens existentes) |
| --- | --- |
| Atalho de teclado ou ação repetida centenas de vezes | Imediato, sem animação ornamental |
| Press feedback ocasional | `scale(0.97)`, 100–160ms; manter hit target estável |
| Tooltip / popover pequeno | 125–200ms, origem no gatilho; tooltip seguinte sem atraso |
| Dropdown / seleção ocasional | 150–250ms, entrada/saída com resposta rápida |
| Modal / drawer | 200–500ms quando necessário, foco/escape, sem espera para interagir |
| Marketing / explicação rara | Só sequência com propósito, conteúdo legível e alternativa estática |

Se não existirem tokens equivalentes, avaliar curva de entrada/saída `cubic-bezier(0.23, 1, 0.32, 1)`, movimento entre estados `cubic-bezier(0.77, 0, 0.175, 1)` e drawer `cubic-bezier(0.32, 0.72, 0, 1)` da referência. Não adicionar sistema paralelo. Evitar ease-in em UI, transition: all, scale(0), layout properties animadas, loops decorativos e atraso no CTA. Usar transform/opacity, origem do gatilho, CSS para movimento previsível, springs para gesto realmente interrompível; `will-change` só com evidência. Não duplicar animação de pai e filhos; sem stagger em listas frequentes. Hover apenas em hover/pointer fine; respeitar reduced-motion e preferência local mais estrita, sem esconder conteúdo. Para 3D, orçamento específico, degradação estática e nenhuma dependência imposta.

## 5. Micro-rodadas futuras — sem autorização implícita de código

1. R1 — Auditoria visual real em Home e rotas críticas, 390/768/1440, registrar screenshots, fonte commit/deployment, interação, frequência, oportunidade e rejeição; comparar baseline de performance. Avaliar se os indícios acima se confirmam.
2. R2 — Direção de arte e protótipo de uma superfície, criar brief com paleta, tipografia, layout, mídia e assinatura; comparar com versão sem motion; evitar alterar contratos.
3. R3 — Implementar apenas o ajuste aprovado, em micro-PR; reusar tokens e componentes existentes. Validar teclado, foco, toque, reduced-motion, interrupção, loading/vazio/erro, textos longos e sem overflow.
4. R4 — Revisão por `review-animations`, `animation-performance`, `break-ui`; registrar antes/depois, LCP/CLS/INP ou gates locais e teste de uso real. Verificar que SEO, SSR, canonical, sitemap, dados, rotas e conversões não regrediram.
5. R5 — Aprender com feedback explícito; acrescentar decisões justificadas ao documento de design local. Merge/publicação só no fluxo aprovado do projeto; uma publicação quando necessária, sem Lovable Max sem autorização.

## 6. GO/NO-GO

GO para implementação somente com baseline visual, brief próprio da marca, propósito de cada movimento, seleção dos módulos pertinentes e uma micro-superfície definida. GO para release somente com gates locais, comparação real nos viewports, interação funcional, reduced-motion, zero regressão crítica de performance/conversão, sem novos riscos de acessibilidade, SSR/SEO e privacidade. NO-GO se movimento interferir na ação, se houver conteúdo invisível, template copiado, alteração comercial incidental, bloqueio de dados, dependência sem justificativa ou validação inconclusiva.

**Registro desta rodada:** leitura de referências e arquivos; documentação proposta/registrada em branch isolada. Nenhum código de aplicação, dependência, banco, DNS ou configuração de hospedagem foi alterado por esta diretriz.

## 7. R1.2 — Auditoria visual inicial da Home (27/11/2026)

- **URL pública observada:** https://precisodeumtecnico.com/
- **Viewport efetivo:** 1363 × 936 CSS px; scrollWidth 1363; captura no navegador alternativo; h1 visual e AX presente.
- **Evidência:** captura de tela do primeiro viewport e leitura de estado público. Hero centralizado em azul com destaque verde, bloco de visita e CTA de triagem, seguido de CTA de atendimento verde. O cabeçalho e botão flutuante repetem WhatsApp; o painel de consentimento sobrepõe a região inferior esquerda da dobra e parte da faixa do CTA. A árvore de acessibilidade registrou várias seções abaixo da dobra (sintomas, serviços, quiz, formulário e FAQ) com opacity: 0 na captura inicial; hipótese de reveal por interseção deve ser reproduzida com rolagem, JS e reduced-motion antes de concluir que há defeito persistente. Não houve overflow horizontal pela medição.
- **P0 — antes de direção de arte:** Revisar Reveal (transition-all/duração 700 ms na leitura R0), manter formulários, conteúdo e links sempre disponíveis em fallback. Validar foco e visibilidade sem movimento/JS e mobile. Orquestrar os CTAs e consentimento.
- **P1 — candidato de protótipo:** Dar hierarquia própria à triagem, visita e condições, com marca e composição distintas; evitar repetição de badges/CTAs apenas por visual. Transições curtas e interrompíveis apenas no quiz e estados de escolha; nenhuma animação de entrada obrigatória em grupos de serviço ou busca.
- **Skills aplicáveis:** find-animation-opportunities, remove-animations, review-animations, emil-design-eng, animation-performance, break-ui e mobile-native quando houver baseline móvel. `prototype` somente após terminar R1.
- **Limites:** Calibração para 1440/390 px não concluída por timeout na extensão; o navegador alternativo permitiu inspeção desktop sem ajuste do viewport. Mobile e tablet pendentes. Não houve submissão de formulários, acionamento de WhatsApp, mudança de consentimento, verificação de commit implantado, medição de Web Vitals ou teste completo de acessibilidade/funil. Nenhuma captura foi incluída no Git. Não alterar contratos comerciais, SEO, dados, dependências, código ou produção com base neste diagnóstico. A aprovação R1 integral permanece pendente.
