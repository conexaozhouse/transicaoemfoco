/* Transição em Foco — CONTEÚDO DA PÁGINA (edite aqui).

   FONTES
   - Pontos Focais CSC e Alçadas FlyTour: planilha "Anotacoes Transicao.xlsx" → DADOS REAIS (não altere sem fonte oficial).
   - Pílulas / canal de dúvidas: PPT "Plano de Estabilização Organizacional".
   - Políticas e FAQ: ⚠ DADOS DE EXEMPLO / PLACEHOLDER — substituir pelo conteúdo oficial.

   CONVENÇÕES
   - url: null → aparece como "Link a definir" (não clicável). Nunca invente URLs.
   - Textos entre [colchetes] são placeholders.
   - Para esconder uma seção inteira, deixe a lista vazia ([]).
*/
window.TF_DATA = {
  meta: {
    titulo: "Transição em Foco",
    chamada: "Se não souber a quem recorrer, comece por aqui.",               // PPT, slide 2
    sobre: "Estabilizar a operação diante da mudança organizacional tratando os riscos de ruptura de estrutura, papéis, alçadas e fluxos de decisão, enquanto fortalecemos a cultura que queremos construir daqui para frente.", // PPT, slide 1
    atualizado: "2026-10-01",                                                // AAAA-MM-DD
    organograma: "../organograma/"
  },

  /* ---------- VÍDEO EM DESTAQUE (pílula #1) ----------
     Para publicar o vídeo real, preencha UM dos campos:
       embed: URL de incorporação (ex.: "https://www.youtube.com/embed/ID" ou Vimeo / Stream) → toca na própria página
       url:   link externo → abre em nova aba
     thumb: imagem de capa (ex.: "images/video-fabrino.jpg"). Sem thumb, aparece a capa padrão. */
  video: {
    rotulo: "Mensagem do Fabrino",
    titulo: "O que já aconteceu até agora?",
    descricao: "Confira a mensagem sobre o momento atual da zhouse.",        // PLACEHOLDER
    autor: "Rafael Fabrino · CEO",
    duracao: null,                                                           // ex.: "4 min"
    thumb: null,
    embed: null,
    url: null
  },

  /* ---------- PILARES (PPT, slide 3 — sem os riscos) ----------
     alvo: seção desta página relacionada ao pilar. */
  pilares: [
    { n: "01", titulo: "Estrutura e papéis", texto: "Desconhecimento sobre quem deve ser acionado e onde as decisões devem ser direcionadas.", icone: "account_tree", alvo: "quem-procurar", acao: "Quem procurar?" },
    { n: "02", titulo: "Alçadas, Processos e Políticas", texto: "Desatualizações de alçadas de aprovação criando riscos de bloqueio operacional e de governança.", icone: "verified_user", alvo: "quem-aprova", acao: "Quem aprova?" },
    { n: "03", titulo: "Confiança e cultura", texto: "Insegurança sobre o futuro e boatos preenchendo o vácuo de informação.", icone: "favorite_border", alvo: "duvidas", acao: "Tenho uma dúvida" }
  ],

  /* ---------- PONTOS FOCAIS CSC (dados reais — aba "Ponto Focais - CSC") ----------
     area, frentes[], pontoFocal (nome) OU email (caixa de atendimento)
     contato: { email, telefone } → ⚠ PLACEHOLDER (mesmos dados de exemplo do Organograma) — substituir pelos contatos reais.
     responsavel, backup, canal, sla: ainda não preenchidos na planilha → aparecem só quando houver valor. */
  pontosFocais: {
    orientacao: "Ponto focal é quem deve ser procurado primeiro para obter orientações, tirar dúvidas e encaminhamentos sobre o assunto. O ponto focal não aprova alçadas nem responde pelas decisões da área e pelas pessoas.",
    passos: [
      { titulo: "Procure primeiro o Ponto Focal", texto: "Orientações, dúvidas e encaminhamentos." },
      { titulo: "Acione a Liderança Responsável pela área", texto: "Na ausência do Ponto Focal, ou se o assunto exigir decisão ou aprovação." }
    ],
    areas: [
      { id: "financeiro", nome: "Financeiro - Contas a Pagar e a Receber", curto: "Financeiro", icone: "account_balance_wallet" },
      { id: "controladoria", nome: "Controladoria - Fiscal e Tributário", curto: "Controladoria", icone: "receipt_long" },
      { id: "fpa", nome: "FP&A", curto: "FP&A", icone: "insights" },
      { id: "pessoas", nome: "Pessoas & Cultura", curto: "Pessoas & Cultura", icone: "people" },
      { id: "ti", nome: "Tecnologia da Informação", curto: "Tecnologia", icone: "computer" },
      { id: "compras", nome: "Compras", curto: "Compras", icone: "shopping_cart" }
    ],
    itens: [
      { area: "financeiro", pontoFocal: "Fabio Hage", contato: { email: "fabio.hage@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Programação e execução de pagamentos", "Pagamento e Recebimento de Invoices", "Reembolso de despesas e adiantamentos de viagem", "Gestão de Cartões Corporativos", "Seguros", "Registro de recebimentos", "Identificação de receitas", "Controle de inadimplência", "Financiamentos"] },
      { area: "controladoria", pontoFocal: "Bruna Martins", contato: { email: "bruna.martins@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Emissão de notas fiscais", "Validação fiscal de pedidos de compra", "Gestão de certificados digitais", "Suporte às rotinas de fechamento contábil", "Esclarecimento de dúvidas e solicitações relacionadas às áreas fiscal e contábil"] },
      { area: "fpa", pontoFocal: "Felipe Caliman", contato: { email: "felipe.caliman@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Planejamento de receitas, despesas, custos, investimentos e resultados", "Orçamento (Budget)", "Forecast e Projeções", "Relatórios Gerenciais"] },
      { area: "pessoas", pontoFocal: "Alessandra Dias", contato: { email: "alessandra.dias@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Atendimento e Suporte à assuntos de RH", "Atração & Seleção", "Estágio, Jovem Aprendiz", "Onboarding", "Desenho Organizacional", "Treinamento & Desenvolvimento", "Apoio às lideranças em reorganizações, transformações e mudanças de estrutura"] },
      { area: "pessoas", pontoFocal: "Fabio Ferreira", contato: { email: "fabio.ferreira@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Processamento de Remuneração", "Políticas de Remuneração", "Cargos e Salarios", "Orçamento de Pessoas", "Indicadores de Gestão de Pessoas", "Indicadores de RH"] },
      { area: "pessoas", pontoFocal: "Mônica Brizolla", contato: { email: "monica.brizolla@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Admissão", "Atendimento a processos de Folha de pagamento", "Férias e Banco de Horas", "Gestão de Benefícios", "Saúde e Segurança do Trabalho", "Homologação"] },
      { area: "ti", email: "suporte@zhouse.com.br", frentes: ["Suporte ao usuário - Service desk", "Atendimento a usuários", "Gestão de acessos", "Suporte a equipamentos"] },
      { area: "ti", email: "atendimentosap@zhouse.com.br", frentes: ["SAP - atendimento, dúvidas, cadastros"] },
      { area: "ti", email: "cadastro@zhouse.com.br", frentes: ["Gestão de acessos e Cadastros - Sistemas de TIs", "Gestão de usuários", "Atendimento a solicitações de acesso", "Cadastros de itens e de fornecedores"] },
      { area: "compras", pontoFocal: "Maria Eduarda", contato: { email: "maria.eduarda@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Cotação e negociação Novos Fornecedores", "Gestão de Fornecedores", "Apoio às operações com primeiro atendimento à demandas de Compras", "Suporte a Solicitações de Pedidos de Compras e Pagamentos no SAP"] },
      { area: "compras", pontoFocal: "Evandro Salles", contato: { email: "evandro.salles@exemplo.com.br", telefone: "(00) 00000-0000" }, frentes: ["Gestão de Frotas", "Gestão Viagens"] }
    ]
  },

  /* ---------- ALÇADAS DE APROVAÇÃO (dados reais — aba "Alçadas Aprovação - Flytour") ----------
     A planilha marca o "Substituto" como "validar" → status "em-validacao" mostra o aviso na página.
     Quando validado, troque para "vigente".
     centroCusto, anterior (aprovador atual na planilha), aprovador (substituto/novo), proprio (quem aprova a viagem do aprovador) */
  alcadas: {
    status: "em-validacao",            // "em-validacao" | "vigente"
    sistemas: [
      { nome: "FlyTour", ativo: true },
      { nome: "SAP", ativo: false },
      { nome: "ADP", ativo: false },
      { nome: "Projuris", ativo: false }
    ],
    /* Comparação exibida em "Quem aprova?" (aba FlyTour).
       comoFunciona = como funcionava (observações da planilha).
       agora = leitura das colunas da planilha (Substituto / Aprovador do próprio aprovador) — revisar com a área. */
    // ⚠ PLACEHOLDER (lorem ipsum) — substituir pelos textos oficiais.
    agora: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam, quis nostrud exercitation ullamco."],
    comoFunciona: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam, quis nostrud exercitation ullamco."],
    observacao: "Uma passagem nacional de R$ 400 e uma viagem internacional de R$ 40 mil seguem o mesmo caminho. As viagens do próprio aprovador serão aprovadas por Rafael Fabrino.",
    documento: null,                   // link para a página/documento oficial de alçadas, quando existir
    regras: [
      { centroCusto: "Hospitalidade, exceto A&B", anterior: "Pedro Treacher", aprovador: "Danilo Zanatta", proprio: "Rafael Fabrino" },
      { centroCusto: "Juçaí Comercial", anterior: "Roberto Haag", aprovador: "Rafael Fabrino", proprio: null },
      { centroCusto: "Operações Agro", anterior: "Roberto Haag", aprovador: "Gilberto Lima", proprio: "Rafael Fabrino" },
      { centroCusto: "ADM zhouse e Operações", anterior: "Raul Gama", aprovador: "Evandro Salles", proprio: "Rafael Fabrino" },
      { centroCusto: "Marketing zhouse e Operações", anterior: "Roberta Morelli", aprovador: "Pedro Treacher", proprio: "Rafael Fabrino" },
      { centroCusto: "zhouse; A&B Operações", anterior: "Fernanda Zanetti", aprovador: "Danilo Zanatta", proprio: "Rafael Fabrino" },
      { centroCusto: "zhouse e Operações", anterior: "Anna Leticia Azevedo", aprovador: "Evandro Salles", proprio: "Rafael Fabrino" },
      { centroCusto: "Comunicação Institucional, Senior L EUA", anterior: "Isabel Bastos", aprovador: "Rafael Fabrino", proprio: null },
      { centroCusto: "Presidência", anterior: "Isabel Bastos", aprovador: "Daniela Veltri ou Evandro Salles", proprio: null },
      { centroCusto: "zhouse e Operações", anterior: "Daniela Veltri", aprovador: "Daniela Veltri", proprio: "Rafael Fabrino" },
      { centroCusto: "Capex Obras; Novos Negócios", anterior: "Beatriz Mauro", aprovador: "Evandro Salles", proprio: null },
      { centroCusto: "Juçaí Fábrica", anterior: "Maria Luiza Silva", aprovador: "Rafael Fabrino", proprio: null },
      { centroCusto: "Humanize ADM; Sustentabilidade", anterior: "Michele Cardoso", aprovador: "Rafael Fabrino", proprio: null },
      { centroCusto: "Oteque", anterior: "Alberto Landgraf", aprovador: "Alberto Landgraf", proprio: "Rafael Fabrino" },
      { centroCusto: "Amma", anterior: "Fernanda Schwarzstein", aprovador: "Fernanda Schwarzstein", proprio: "Rafael Fabrino" },
      { centroCusto: "Flávia Aranha", anterior: "Flavia Aranha", aprovador: "Flavia Aranha", proprio: "Rafael Fabrino" },
      { centroCusto: "Usuários - Obras", anterior: "Carolina Pinheiro", aprovador: "Daniela Veltri", proprio: null },
      { centroCusto: "Usuários - Sustentabilidade*", anterior: "Eline Matos Martins", aprovador: "Rafael Fabrino", proprio: null }
      // Linha "Usuário — Felipe Motollo Cesar → EXCLUSÃO" omitida (exclusão de usuário, não é regra de aprovação).
    ]
  },

  /* ---------- POLÍTICAS ⚠ DADOS DE EXEMPLO ----------
     exemplo: true mostra o aviso "Conteúdo de exemplo" na seção. Troque para false quando publicar as políticas reais.
     tag: "nova" | "atualizada" | "importante" | "em-revisao" | null */
  politicasExemplo: true,
  politicas: [
    { titulo: "Política de Viagens", categoria: "Viagens", descricao: "Texto de exemplo: como solicitar, aprovar e prestar contas de viagens corporativas.", atualizada: "2026-09-29", tag: "atualizada", url: null },
    { titulo: "Política de Compras", categoria: "Compras", descricao: "Texto de exemplo: etapas de uma solicitação de compra, da cotação ao pedido.", atualizada: "2026-09-24", tag: "importante", url: null },
    { titulo: "Política de Uso de Sistemas", categoria: "Tecnologia", descricao: "Texto de exemplo: acessos, senhas e boas práticas no uso dos sistemas.", atualizada: "2026-09-22", tag: "nova", url: null },
    { titulo: "Política de Reembolsos", categoria: "Financeiro", descricao: "Texto de exemplo: o que pode ser reembolsado e como enviar comprovantes.", atualizada: "2026-09-18", tag: "em-revisao", url: null },
    { titulo: "Política de Contratação de Fornecedores", categoria: "Compras", descricao: "Texto de exemplo: critérios e documentos para cadastrar um novo fornecedor.", atualizada: "2026-09-10", tag: null, url: null },
    { titulo: "Política de Cartões Corporativos", categoria: "Financeiro", descricao: "Texto de exemplo: uso, limites e conciliação do cartão corporativo.", atualizada: "2026-09-05", tag: null, url: null }
  ],

  /* ---------- FAQ ⚠ PERGUNTAS E RESPOSTAS DE EXEMPLO (lorem ipsum) — substituir pelo conteúdo oficial ----------
     exemplo: true → a resposta mostra o selo "Resposta de exemplo".
     acao: { texto, alvo } leva a uma seção desta página (alvo = id da seção). */
  faqExemplo: true,
  faq: [
    { categoria: "Quem procurar", pergunta: "Quem devo procurar quando tenho uma dúvida sobre determinado assunto?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", exemplo: true, acao: { texto: "Consultar Pontos Focais CSC", alvo: "quem-procurar" } },
    { categoria: "Quem procurar", pergunta: "Onde encontro os contatos dos pontos focais?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", exemplo: true, acao: { texto: "Consultar Pontos Focais CSC", alvo: "quem-procurar" } },
    { categoria: "Aprovações", pergunta: "Como funcionam as novas alçadas de aprovação?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", exemplo: true, acao: { texto: "Consultar alçadas", alvo: "quem-aprova" } },
    { categoria: "Aprovações", pergunta: "Quem pode aprovar uma determinada solicitação?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.", exemplo: true, acao: { texto: "Consultar alçadas", alvo: "quem-aprova" } },
    { categoria: "Políticas e processos", pergunta: "Onde encontro as políticas atualizadas?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.", exemplo: true, acao: { texto: "Ver políticas", alvo: "politicas" } },
    { categoria: "Políticas e processos", pergunta: "Onde encontro informações sobre os processos?", resposta: "Lorem ipsum dolor sit amet.", exemplo: true },
    { categoria: "Canal de dúvidas", pergunta: "Como envio uma dúvida ou sugestão?", resposta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", exemplo: true }
  ],

  /* ---------- CANAL DE DÚVIDAS (PPT: "Transição em Foco #1 | Suas dúvidas têm endereço") ---------- */
  canal: {
    titulo: "Suas dúvidas têm endereço",
    texto: "Sabemos que, neste momento, muitas perguntas ficaram sem dono. Para que nenhuma fique sem resposta, criamos um canal único.",
    complemento: "As perguntas mais frequentes vão virar nosso FAQ, atualizado toda semana.",
    canalTexto: null,
    canalUrl: null
  },

  /* ---------- FORMULÁRIO "ENVIAR MINHA DÚVIDA" → Jotform ----------
     O formulário abre numa janela desta página e envia direto para o Jotform (as respostas caem lá).
     "campos": nomes internos (name="") confirmados no código-fonte do Jotform. Se mudar as perguntas lá, atualize aqui.
     "opcoes" precisa ser o texto EXATO das opções do campo de escolha no Jotform. */
  jotform: {
    formId: "262736434658669",
    campos: {
      identificar: "q184_voceDeseja",
      nome: "q185_nomeCompleto",
      territorio: "q187_territorio",
      contato: "q186_emailOu",
      duvida: "q174_descrevaSua"
    },
    opcoes: { sim: "Sim, quero me identificar", nao: "Não, prefiro enviar anonimamente" }
  },

  /* ---------- NOVIDADES: pílulas da campanha (PPT, slide 4) ----------
     status: "disponivel" | "em-breve"
     alvo: id de uma seção desta página onde o conteúdo já está (o card leva até lá)
     url: link externo (Conexão, vídeo, comunicado…) — quando existir
     etapas/semanas: cronograma interno de produção da Comunicação. Fica guardado, mas NÃO aparece na página. */
  pilulas: [
    { n: 1, titulo: "O que já aconteceu até agora?", resumo: "Vídeo do Fabrino + e-mails após a reestruturação", icone: "play_circle_outline", status: "disponivel", alvo: "inicio", url: null, producao: { entrega: [1, 1] } },
    { n: 2, titulo: "O que vem por aí?", resumo: "Próximos passos e prioridades da nova gestão", icone: "explore", status: "em-breve", alvo: null, url: null, producao: { prep: [1, 1], entrega: [2, 2] } },
    { n: 3, titulo: "Quem procurar", resumo: "Estrutura e papéis: pontos focais por área e assunto", icone: "contact_support", status: "disponivel", alvo: "quem-procurar", url: null, producao: { prep: [1, 2], entrega: [3, 3] } },
    { n: 4, titulo: "Como aprovamos agora", resumo: "Alçadas de aprovação", icone: "verified_user", status: "disponivel", alvo: "quem-aprova", url: null, producao: { prep: [1, 3], entrega: [4, 4] } },
    { n: 5, titulo: "Estamos ouvindo", resumo: "Espaço no Conexão ou e-mail para dúvidas e comentários", icone: "forum", status: "em-breve", alvo: "duvidas", url: null, producao: { prep: [3, 4], entrega: [5, 8] } },
    { n: 6, titulo: "Espaço Você sabe?", resumo: "Políticas: responsável, prazo, onde solicitar, dúvidas e link da política", icone: "menu_book", status: "em-breve", alvo: "politicas", url: null, producao: { prep: [2, 5], entrega: [6, 8] } },
    { n: 7, titulo: "Novas conquistas", resumo: "Histórias de pessoas e da nova gestão · nova IA zhouse", icone: "emoji_events", status: "em-breve", alvo: null, url: null, producao: { prep: [5, 6], entrega: [7, 7] } },
    { n: 8, titulo: "Gestão do Conhecimento", resumo: "Mapeamento e documentação de processos no Conexão", icone: "library_books", status: "em-breve", alvo: null, url: null, producao: { prep: [4, 7], entrega: [8, 8] } },
    { n: 9, titulo: "Nova narrativa de transformação", resumo: "Necessidade de mudança, visão de futuro e caminho para chegar lá", icone: "auto_awesome", status: "em-breve", alvo: null, url: null, producao: { prep: [6, 7], entrega: [8, 8] } }
  ],
  semanas: ["2026-09-21", "2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09"]
};
