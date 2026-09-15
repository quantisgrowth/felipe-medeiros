# Plano — Landing page Felipe Medeiros

## Objetivo
Criar uma landing page premium, responsiva e focada em converter empresários e gestores em solicitações do Diagnóstico Comercial Estratégico, posicionando Felipe como responsável por diagnóstico, estratégia e implementação.

## Estrutura e experiência
- Substituir a tela inicial pela landing completa, em português, com cabeçalho fixo, navegação por âncoras e CTA acessível no celular.
- Construir as 16 seções solicitadas na ordem definida: apresentação, autoridade, problemas, manifesto, solução, fluxo, comparação, metodologia, entregáveis, qualificação, tecnologias, sobre, diferencial, CTA, formulário, FAQ e encerramento.
- Criar rodapé, botão flutuante do WhatsApp e uma página `/obrigado` que mantenha os parâmetros UTM.
- Usar todos os textos fornecidos sem inventar clientes, provas, números, certificações, resultados ou depoimentos.

## Direção visual
- Aplicar a paleta fornecida com fundo claro, grafite, azul elétrico, azul escuro e dourado pontual, convertida em tokens semânticos do projeto.
- Usar Poppins nos títulos e Questrial nos textos, com carregamento adequado das fontes.
- Adotar visual corporativo e tecnológico: bastante espaço, bordas finas, sombras discretas, cantos de 12–18 px, ícones Lucide e gradientes azuis sutis.
- Criar elementos abstratos de fluxo, conexão e dados; o painel comercial será conceitual, não uma captura de software.
- Reservar um espaço elegante e claramente substituível para a foto profissional de Felipe e outro para futura imagem Open Graph.
- Incluir animações suaves de entrada e respeitar a preferência do sistema por movimento reduzido.

## Componentes
Organizar a página nos componentes pedidos: `Header`, `Hero`, `AuthorityBar`, `Problems`, `Manifesto`, `SolutionCards`, `ProcessFlow`, `BeforeAfter`, `Methodology`, `Deliverables`, `Qualification`, `Technologies`, `About`, `Differentials`, `DiagnosticCTA`, `LeadForm`, `FAQ`, `Footer` e `FloatingWhatsApp`.

Também serão criados elementos reutilizáveis para títulos de seção, botões de ação, ícones de status e rastreamento de eventos.

## Formulário e conversão
- Implementar todos os campos e o consentimento obrigatório, com labels visíveis e validação de formato e tamanho no navegador.
- Enviar o payload solicitado ao endereço configurado em `VITE_LEAD_WEBHOOK_URL`, incluindo `source`, URL da página, data e UTMs.
- Em desenvolvimento, quando a variável não existir, simular um envio bem-sucedido; a indicação de configuração ficará apenas no código.
- Exibir estados de envio, sucesso e falha com os textos fornecidos.
- Após sucesso, redirecionar para `/obrigado` preservando `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`.
- Disponibilizar alternativa direta pelo WhatsApp quando houver falha.
- Não adicionar banco de dados nem autenticação; o fluxo será navegador → webhook n8n → DataCrazy.

## Links e placeholders
Centralizar os valores editáveis para:
- `[WHATSAPP_NUMBER]`
- `[WHATSAPP_MESSAGE]`
- `[EMAIL]`
- `[LINKEDIN_URL]`
- `[PRIVACY_URL]`
- `[TERMS_URL]`
- `[GA_MEASUREMENT_ID]`
- `[META_PIXEL_ID]`

O WhatsApp usará `wa.me` com a mensagem inicial fornecida e codificada corretamente. Placeholders ainda não substituídos permanecerão visíveis no código, sem chaves ou credenciais privadas.

## Analytics e SEO
- Preparar uma camada segura de eventos para `cta_whatsapp_click`, `diagnostic_form_start`, `diagnostic_form_submit`, `diagnostic_form_success`, `diagnostic_form_error` e `linkedin_click`.
- Ativar Google Analytics e Meta Pixel somente quando os identificadores reais forem configurados.
- Configurar metadados exclusivos para `/` e `/obrigado`, incluindo title, description, Open Graph, twitter card, canonical e `noindex` na página de agradecimento.
- Criar favicon provisório “FM”.
- Reservar a imagem Open Graph sem publicar uma URL fictícia ou quebrada.

## Acessibilidade e comportamento
- Garantir HTML semântico, um único H1 por página, contraste adequado, foco visível, navegação por teclado, nomes acessíveis e textos alternativos.
- Implementar accordion acessível no FAQ e menu compacto acessível no celular.
- Garantir fluxo horizontal no desktop e vertical no celular para as etapas da operação.
- Evitar pop-ups imediatos, contadores, escassez falsa, excesso de efeitos e imagens clichês de IA.

## Validação final
- Conferir a página completa em desktop e celular, incluindo larguras intermediárias.
- Testar menu, âncoras, WhatsApp, LinkedIn, accordion e página de agradecimento.
- Testar validações e estados de envio, sucesso e erro do formulário.
- Verificar textos cortados, sobreposições, contraste, foco, ausência de conteúdo genérico em inglês e ausência de dados fictícios.
- Confirmar que a aplicação compila sem erros e revisar os sinais do navegador.
- Entregar um resumo dos arquivos alterados e a lista dos placeholders que ainda exigem dados reais.

## Detalhes técnicos
- Manter React 19, TypeScript, TanStack Start e Tailwind CSS v4 já presentes no projeto.
- Não criar rotas separadas para as seções da landing, pois a navegação por âncoras e rolagem suave foi explicitamente solicitada; apenas `/obrigado` será uma rota adicional.
- Não usar imagens remotas; os elementos visuais serão construídos localmente e preparados para substituição futura.
- Como `VITE_LEAD_WEBHOOK_URL` é lida pelo navegador, ela deve conter somente a URL pública do webhook, nunca tokens ou credenciais.
