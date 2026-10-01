/* Transição em Foco — hub do colaborador. Renderização e interação (sem dependências). Conteúdo em js/data.js */
(function () {
  'use strict';

  var D = window.TF_DATA;
  var root = document.getElementById('tf-app');
  if (!D || !root) return;

  /* ---------- utilitários ---------- */
  function el(tag, cls, attrs, kids) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'style') n.style.cssText = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function icon(name) { return el('span', 'tf-icon', { 'aria-hidden': 'true', text: name }); }
  function norm(s) { return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function matches(hay, q) { var h = norm(hay); return norm(q).split(/\s+/).filter(Boolean).every(function (t) { return h.indexOf(t) > -1; }); }
  function parse(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dmy(s) { var d = parse(s); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function initials(name) {
    return (name || '').split(/\s+/).filter(function (w) { return w.length > 2 || /^[A-ZÀ-Ú]/.test(w); })
      .filter(function (w) { return !/^(de|da|do|dos|das|ou|e)$/i.test(w); }).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }
  function highlight(text, q) {
    var frag = document.createDocumentFragment();
    var toks = norm(q).split(/\s+/).filter(function (t) { return t.length > 2; });
    if (!toks.length) { frag.appendChild(document.createTextNode(text)); return frag; }
    var n = norm(text), marks = [];
    toks.forEach(function (t) { var i = n.indexOf(t); while (i > -1) { marks.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } });
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var pos = 0;
    marks.forEach(function (m) { if (m[0] < pos) return; frag.appendChild(document.createTextNode(text.slice(pos, m[0]))); frag.appendChild(el('mark', null, { text: text.slice(m[0], m[1]) })); pos = m[1]; });
    frag.appendChild(document.createTextNode(text.slice(pos)));
    return frag;
  }
  function flash(node) { if (!node) return; node.classList.remove('is-flash'); void node.offsetWidth; node.classList.add('is-flash'); setTimeout(function () { node.classList.remove('is-flash'); }, 1700); }
  function ext(url) { return /^(mailto:|tel:)/.test(url) ? {} : { target: '_blank', rel: 'noopener' }; }
  function assign(a, b) { for (var k in b) a[k] = b[k]; return a; }

  var PF = D.pontosFocais || { areas: [], itens: [] };
  var AL = D.alcadas || { regras: [] };
  function areaById(id) { for (var i = 0; i < PF.areas.length; i++) if (PF.areas[i].id === id) return PF.areas[i]; return { nome: id, curto: id, icone: 'work_outline' }; }

  var NAV = [
    { id: 'inicio', label: 'Início', sub: 'Mensagem do Fabrino', icon: 'home' },
    { id: 'pilares', label: 'Pilares', sub: 'O que estamos organizando', icon: 'flag' },
    { id: 'quem-procurar', label: 'Quem procurar?', sub: 'Pontos Focais CSC', icon: 'contact_support' },
    { id: 'quem-aprova', label: 'Quem aprova?', sub: 'Alçadas de Aprovação', icon: 'verified_user' },
    { id: 'politicas', label: 'O que mudou?', sub: 'Políticas e documentos', icon: 'menu_book' },
    { id: 'duvidas', label: 'Tenho uma dúvida', sub: 'Dúvidas frequentes', icon: 'forum' }
  ];

  var barEl;
  function goTo(id, instant) {
    var t = document.getElementById(id);
    if (!t) return;
    var y = id === 'inicio' ? 0 : t.getBoundingClientRect().top + window.pageYOffset - (barEl ? barEl.offsetHeight : 0) - 16;
    window.scrollTo({ top: Math.max(0, y), behavior: instant ? 'auto' : 'smooth' });
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }

  /* ---------- topo (mesmo padrão do Organograma) ---------- */
  function header() {
    // seletor de seção
    var picker = el('div', 'tf-picker');
    var pickVal = el('span', 'tf-picker-val');
    var pickBtn = el('button', 'tf-picker-btn', { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-controls': 'tf-menu' }, [el('span', 'tf-picker-lbl', { text: 'Seção' }), pickVal, icon('expand_more')]);
    var menu = el('ul', 'tf-menu', { id: 'tf-menu', role: 'listbox', 'aria-label': 'Ir para a seção', hidden: '' });
    NAV.forEach(function (n) {
      menu.appendChild(el('li', null, { role: 'presentation' }, [
        el('button', 'tf-menu-item', { type: 'button', role: 'option', 'aria-selected': 'false', 'data-target': n.id, tabindex: '-1', onclick: function () { closeMenu(); goTo(n.id); } }, [
          el('span', 'tf-menu-ic', { 'aria-hidden': 'true' }, [icon(n.icon)]),
          el('span', 'tf-menu-text', null, [el('strong', null, { text: n.label }), el('span', null, { text: n.sub })]),
          el('span', 'tf-menu-check', { 'aria-hidden': 'true' }, [icon('check')])
        ])
      ]));
    });
    function items() { return [].slice.call(menu.querySelectorAll('.tf-menu-item')); }
    function openMenu() { menu.hidden = false; pickBtn.setAttribute('aria-expanded', 'true'); var s = menu.querySelector('[aria-selected="true"]') || items()[0]; if (s) s.focus(); }
    function closeMenu(refocus) { if (menu.hidden) return; menu.hidden = true; pickBtn.setAttribute('aria-expanded', 'false'); if (refocus) pickBtn.focus(); }
    pickBtn.addEventListener('click', function () { if (menu.hidden) openMenu(); else closeMenu(); });
    pickBtn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openMenu(); } });
    menu.addEventListener('keydown', function (e) {
      var l = items(), i = l.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); l[(i + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length].focus(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') e.preventDefault(); closeMenu(e.key === 'Escape'); }
    });
    document.addEventListener('click', function (e) { if (!picker.contains(e.target)) closeMenu(); });
    picker.appendChild(pickBtn); picker.appendChild(menu);
    root._setSection = function (id) {
      var n = NAV.filter(function (x) { return x.id === id; })[0] || NAV[0];
      pickVal.textContent = n.label;
      items().forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-target') === n.id ? 'true' : 'false'); });
      homeBtn.disabled = n.id === 'inicio' && window.pageYOffset < 8;
    };
    root._closeMenu = function () { if (!menu.hidden) { closeMenu(true); return true; } return false; };

    var homeBtn = el('button', 'tf-icon-btn', { type: 'button', 'aria-label': 'Voltar ao início', title: 'Voltar ao início', onclick: function () { goTo('inicio'); } }, [icon('home')]);

    // ajuda (dicas em carrossel, como no organograma)
    var TIPS = [
      ['search', 'Busque um assunto', 'Digite um tema, pessoa ou centro de custo. Atalho: tecla /'],
      ['contact_support', 'Quem procurar?', 'Abra um ponto focal para ver as frentes de serviço e o contato.'],
      ['verified_user', 'Quem aprova?', 'Em “Consultar alçadas”, busque pelo seu centro de custo.'],
      ['forum', 'Tenho uma dúvida', 'Veja as dúvidas frequentes ou envie a sua pelo canal da transição.']
    ];
    var tipIdx = 0;
    var tipIc = el('span', 'tf-tip-ic', { 'aria-hidden': 'true' }), tipTitle = el('strong', 'tf-tip-title'), tipText = el('p', 'tf-tip-text'), tipCount = el('span', 'tf-tip-count');
    var dots = el('div', 'tf-tip-dots', { role: 'tablist', 'aria-label': 'Dicas' }, TIPS.map(function (t, i) { return el('button', 'tf-tip-dot', { type: 'button', role: 'tab', 'aria-label': 'Dica ' + (i + 1), onclick: function () { showTip(i); } }); }));
    function showTip(i) {
      tipIdx = (i + TIPS.length) % TIPS.length; var t = TIPS[tipIdx];
      tipIc.textContent = ''; tipIc.appendChild(icon(t[0])); tipTitle.textContent = t[1]; tipText.textContent = t[2];
      tipCount.textContent = (tipIdx + 1) + ' de ' + TIPS.length;
      [].forEach.call(dots.children, function (d, k) { d.setAttribute('aria-selected', k === tipIdx ? 'true' : 'false'); });
    }
    showTip(0);
    var help = el('div', 'tf-help');
    var helpBtn = el('button', 'tf-icon-btn', { type: 'button', 'aria-label': 'Sobre esta página', title: 'Como usar', 'aria-expanded': 'false', 'aria-controls': 'tf-help-panel' }, [icon('help_outline')]);
    var panel = el('div', 'tf-help-panel', { id: 'tf-help-panel', role: 'dialog', 'aria-label': 'Sobre esta página', hidden: '' }, [
      el('div', 'tf-help-head', null, [
        el('span', 'tf-badge-ic', { 'aria-hidden': 'true' }, [icon('info_outline')]),
        el('div', null, null, [el('strong', 'tf-help-title', { text: 'Sobre o ' + D.meta.titulo }), el('span', 'tf-help-updated', { text: 'Atualizado em ' + dmy(D.meta.atualizado) })])
      ]),
      el('p', 'tf-help-about', { text: D.meta.sobre }),
      el('div', 'tf-tip', null, [
        el('div', 'tf-tip-top', null, [el('span', 'tf-tip-label', { text: 'Como usar' }), tipCount]),
        el('div', 'tf-tip-body', { 'aria-live': 'polite' }, [tipIc, el('div', null, null, [tipTitle, tipText])]),
        el('div', 'tf-tip-foot', null, [
          el('button', 'tf-tip-nav', { type: 'button', 'aria-label': 'Dica anterior', onclick: function () { showTip(tipIdx - 1); } }, [icon('chevron_left')]),
          dots,
          el('button', 'tf-tip-nav', { type: 'button', 'aria-label': 'Próxima dica', onclick: function () { showTip(tipIdx + 1); } }, [icon('chevron_right')])
        ])
      ]),
      D.meta.organograma ? el('a', 'tf-help-link', assign({ href: D.meta.organograma }, ext(D.meta.organograma)), [icon('account_tree'), 'Abrir o Organograma zhouse']) : null
    ]);
    function toggleHelp(on) { panel.hidden = !on; helpBtn.setAttribute('aria-expanded', on ? 'true' : 'false'); }
    helpBtn.addEventListener('click', function () { toggleHelp(panel.hidden); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') showTip(tipIdx + 1); else if (e.key === 'ArrowLeft') showTip(tipIdx - 1); });
    document.addEventListener('click', function (e) { if (!help.contains(e.target)) toggleHelp(false); });
    help.appendChild(helpBtn); help.appendChild(panel);
    root._closeHelp = function () { if (!panel.hidden) { toggleHelp(false); helpBtn.focus(); return true; } return false; };

    var search = heroSearch();
    root._search = search;

    barEl = el('header', 'tf-top', null, [el('div', 'tf-top-inner', null, [el('div', 'tf-titlebar', null, [
      el('div', 'tf-title', null, [
        el('div', 'tf-title-badge', { 'aria-hidden': 'true' }, [icon('center_focus_strong')]),
        el('div', null, null, [el('h1', null, { text: D.meta.titulo }), el('p', null, { text: D.meta.chamada })])
      ]),
      el('div', 'tf-controls', null, [homeBtn, picker, search, help])
    ])])]);
    root._setSection('inicio');
    return barEl;
  }

  /* ---------- busca geral ---------- */
  var finder, policiesApi, faqApi;
  function buildIndex() {
    var idx = [];
    PF.itens.forEach(function (it, i) {
      var a = areaById(it.area), who = it.pontoFocal || it.email;
      it.frentes.forEach(function (f) {
        idx.push({ g: 'Quem procurar', ic: a.icone, t: f, s: 'Ponto focal: ' + who + ' · ' + a.curto, hay: f + ' ' + a.nome, go: function (q) { finder.focusItem(i, q); } });
      });
      idx.push({ g: 'Quem procurar', ic: it.email ? 'mail_outline' : 'person_outline', t: who, s: a.nome, hay: who + ' ' + a.nome, go: function (q) { finder.focusItem(i, q); } });
    });
    AL.regras.forEach(function (r) {
      idx.push({ g: 'Quem aprova · FlyTour', ic: 'verified_user', t: r.centroCusto, s: 'Aprovador: ' + r.aprovador, hay: r.centroCusto + ' ' + r.aprovador + ' ' + r.anterior + ' viagem viagens flytour aprovação alçada', go: function () { openRules(r.centroCusto); } });
    });
    (D.politicas || []).forEach(function (p, i) {
      idx.push({ g: 'Políticas' + (D.politicasExemplo ? ' (exemplo)' : ''), ic: 'description', t: p.titulo, s: p.categoria, hay: p.titulo + ' ' + p.categoria + ' ' + p.descricao, go: function () { policiesApi.focus(i); } });
    });
    (D.faq || []).forEach(function (f, i) {
      idx.push({ g: 'Dúvidas frequentes', ic: 'quiz', t: f.pergunta, s: f.categoria, hay: f.pergunta + ' ' + f.categoria, go: function () { faqApi.open(i); } });
    });
    return idx;
  }

  function heroSearch() {
    var idx = buildIndex();
    var input = el('input', null, { type: 'search', placeholder: 'Buscar assunto, pessoa ou centro de custo', 'aria-label': 'Buscar no Transição em Foco', autocomplete: 'off', role: 'combobox', 'aria-expanded': 'false', 'aria-controls': 'tf-results' });
    var kbd = el('kbd', 'tf-kbd', { text: '/', title: 'Atalho: /' });
    var clear = el('button', 'tf-clear', { type: 'button', 'aria-label': 'Limpar busca', hidden: '' }, [icon('close')]);
    var list = el('ul', 'tf-results', { id: 'tf-results', role: 'listbox', hidden: '' });
    var active = -1, btns = [];

    function render() {
      var q = input.value.trim();
      clear.hidden = !q; kbd.hidden = !!q;
      list.innerHTML = ''; btns = []; active = -1;
      if (q.length < 2) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      var groups = {}, order = [];
      idx.forEach(function (r) { if (!matches(r.hay + ' ' + r.t, q)) return; if (!groups[r.g]) { groups[r.g] = []; order.push(r.g); } if (groups[r.g].length < 5) groups[r.g].push(r); });
      if (!order.length) list.appendChild(el('li', 'tf-res-empty', { text: 'Nada encontrado para "' + q + '". Tente outra palavra ou envie sua dúvida.' }));
      order.forEach(function (g) {
        list.appendChild(el('li', 'tf-res-group', { role: 'presentation', text: g }));
        groups[g].forEach(function (r) {
          var b = el('button', 'tf-res', { type: 'button', role: 'option', onclick: function () { pick(r); } }, [
            el('span', 'tf-res-ic', { 'aria-hidden': 'true' }, [icon(r.ic)]),
            el('span', 'tf-res-text', null, [el('strong', null, null, [highlight(r.t, q)]), el('span', null, { text: r.s })])
          ]);
          btns.push(b); list.appendChild(el('li', null, { role: 'presentation' }, [b]));
        });
      });
      list.hidden = false; input.setAttribute('aria-expanded', 'true');
    }
    function pick(r) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); r.go(input.value.trim()); }
    function mark(i) { btns.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); }); active = i; if (btns[i]) { var li = btns[i].parentNode; list.scrollTop = Math.max(0, li.offsetTop - list.clientHeight + li.offsetHeight + 6); } }
    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value.trim().length > 1) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(btns.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (btns[active]) btns[active].click(); else if (btns[0]) btns[0].click(); }
      else if (e.key === 'Escape') { if (!list.hidden) { e.stopPropagation(); list.hidden = true; } else { input.value = ''; render(); } }
    });
    clear.addEventListener('click', function () { input.value = ''; render(); input.focus(); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) list.hidden = true; });
    var wrap = el('div', 'tf-search', null, [el('div', 'tf-search-field', null, [icon('search'), input, kbd, clear]), list]);
    wrap._input = input; wrap._set = function (q) { input.value = q; render(); input.focus(); };
    return wrap;
  }

  /* ---------- início: vídeo + acessos ---------- */
  function intro() {
    var quick = el('div', 'tf-quick', null, NAV.slice(1).map(function (n) {
      return el('button', 'tf-quick-card' + (n.id === 'quem-procurar' || n.id === 'quem-aprova' ? ' is-primary' : ''), { type: 'button', onclick: function () { goTo(n.id); } }, [
        el('span', 'tf-quick-ic', { 'aria-hidden': 'true' }, [icon(n.icon)]),
        el('span', 'tf-quick-text', null, [el('strong', null, { text: n.label }), el('span', null, { text: n.sub })]),
        el('span', 'tf-quick-arrow tf-icon', { 'aria-hidden': 'true', text: 'arrow_forward' })
      ]);
    }));
    return el('section', 'tf-section tf-intro', { id: 'inicio', 'aria-label': 'Início' }, [video()]);
  }

  function video() {
    var V = D.video || {};
    var pending = !V.embed && !V.url;
    var media = el('div', 'tf-video-media');
    var ph = pending ? el('span', 'tf-video-chip is-ph', { text: 'Vídeo a publicar' }) : null;
    var play = el('button', 'tf-video-play', { type: 'button', 'aria-label': 'Assistir: ' + V.rotulo + ' — ' + V.titulo }, [
      el('span', 'tf-video-btn', { 'aria-hidden': 'true' }, [icon('play_arrow')])
    ]);
    play.addEventListener('click', function () {
      if (V.embed) {
        media.innerHTML = '';
        media.appendChild(el('iframe', null, { src: V.embed + (V.embed.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1', title: V.rotulo, allow: 'autoplay; fullscreen; picture-in-picture', allowfullscreen: '' }));
      } else if (V.url) window.open(V.url, '_blank', 'noopener');

    });
    media.appendChild(V.thumb ? el('img', null, { src: V.thumb, alt: '' }) : el('div', 'tf-video-cover', { 'aria-hidden': 'true' }));
    media.appendChild(play);
    return el('article', 'tf-card tf-video', { 'aria-label': V.rotulo }, [
      media,
      el('div', 'tf-video-info', null, [
        el('h2', null, { text: V.titulo }),
        el('p', null, { text: V.descricao + (V.duracao ? ' · ' + V.duracao : '') }),
        el('div', 'tf-video-meta', null, [
          el('span', 'tf-avatar', { 'aria-hidden': 'true', text: initials('Rafael Fabrino') }),
          el('div', null, null, [el('strong', null, { text: V.autor }), el('span', null, { text: V.rotulo })])
        ])
      ])
    ]);
  }

  /* ---------- pilares ---------- */
  function pilaresSection() {
    var list = D.pilares || [];
    if (!list.length) return null;
    return el('section', 'tf-section tf-reveal', { id: 'pilares', 'aria-label': 'Pilares da transição' }, [
      secHead('Pilares da transição', 'flag', 'O que estamos organizando', D.meta.sobre),
      el('div', 'tf-pillars', null, list.map(function (p) {
        return el('button', 'tf-card tf-pillar', { type: 'button', onclick: function () { if (p.alvo) goTo(p.alvo); } }, [
          el('div', 'tf-pillar-top', null, [el('span', 'tf-pillar-ic', { 'aria-hidden': 'true' }, [icon(p.icone)]), el('span', 'tf-pillar-n', { text: p.n })]),
          el('strong', null, { text: p.titulo }),
          el('p', null, { text: p.texto }),
          p.acao ? el('span', 'tf-pillar-go', null, [p.acao, icon('arrow_forward')]) : null
        ]);
      }))
    ]);
  }

  function secHead(eyebrow, ic, title, lead, extra) {
    return el('div', 'tf-sec-head', null, [
      el('div', null, null, [
        el('span', 'tf-eyebrow', null, [ic ? icon(ic) : null, eyebrow]),
        el('h2', 'tf-h2', { text: title }),
        lead ? el('p', 'tf-lead', { text: lead }) : null
      ]),
      extra || null
    ]);
  }

  /* ---------- quem procurar (cards compactos que abrem a janela, como no organograma) ---------- */
  function whoSection() {
    var state = { q: '', area: '' };
    var cards = [];
    var input = el('input', null, { type: 'search', placeholder: 'Qual é o assunto? Ex.: reembolso, férias, SAP', 'aria-label': 'Buscar assunto nos Pontos Focais', autocomplete: 'off' });
    var clear = el('button', 'tf-clear', { type: 'button', 'aria-label': 'Limpar', hidden: '' }, [icon('close')]);
    var chips = el('div', 'tf-chips', { role: 'group', 'aria-label': 'Filtrar por área' });
    var chipBtns = [];
    [{ id: '', curto: 'Todas', icone: null }].concat(PF.areas).forEach(function (a) {
      var b = el('button', 'tf-chip-btn', { type: 'button', 'aria-pressed': a.id === '' ? 'true' : 'false', onclick: function () { state.area = a.id; update(); } }, [a.icone ? icon(a.icone) : null, a.curto]);
      b._id = a.id; chipBtns.push(b); chips.appendChild(b);
    });
    var grid = el('div', 'tf-pf-grid');
    var empty = el('div', 'tf-pf-empty', { hidden: '' }, [icon('search_off'), el('p', null, { text: 'Nenhum ponto focal encontrado para esse assunto.' }),
      el('button', 'tf-link-btn', { type: 'button', onclick: function () { goTo('duvidas'); } }, ['Envie sua dúvida', icon('arrow_forward')])]);

    PF.itens.forEach(function (it) {
      var a = areaById(it.area);
      var who = it.pontoFocal || it.email;
      var sum = el('span', 'tf-pf-tags');
      var c = { it: it, a: a, sum: sum };
      c.node = el('button', 'tf-pf', { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': who + ', ' + a.nome + '. Ver frentes e contato', onclick: function () { openPerson(it, state.q); } }, [
        it.email ? el('span', 'tf-avatar is-mail', { 'aria-hidden': 'true' }, [icon('alternate_email')]) : el('span', 'tf-avatar', { 'aria-hidden': 'true', text: initials(who) }),
        el('span', 'tf-pf-text', null, [
          el('span', 'tf-pf-name', { text: who }),
          el('span', 'tf-pf-area', null, [icon(a.icone), a.curto]),
          sum
        ]),
        icon('chevron_right')
      ]);
      cards.push(c); grid.appendChild(c.node);
    });

    function update() {
      state.q = input.value.trim();
      clear.hidden = !state.q;
      chipBtns.forEach(function (b) { b.setAttribute('aria-pressed', b._id === state.area ? 'true' : 'false'); });
      var n = 0;
      cards.forEach(function (c) {
        var okArea = !state.area || c.it.area === state.area;
        var hits = state.q ? c.it.frentes.filter(function (f) { return matches(f, state.q); }) : [];
        var okQ = !state.q || hits.length || matches(c.a.nome + ' ' + (c.it.pontoFocal || c.it.email), state.q);
        c.node.hidden = !(okArea && okQ); if (!c.node.hidden) n++;
        c.sum.textContent = '';
        var ordered = hits.concat(c.it.frentes.filter(function (f) { return hits.indexOf(f) < 0; }));
        ordered.slice(0, 1).forEach(function (f) { var t = el('span', 'tf-pf-tag' + (hits.indexOf(f) > -1 ? ' is-match' : ''), { title: f }); t.appendChild(highlight(f, state.q)); c.sum.appendChild(t); });
        if (ordered.length > 1) c.sum.appendChild(el('span', 'tf-pf-more', { text: '+' + (ordered.length - 1) }));
      });
      empty.hidden = n > 0;
    }
    input.addEventListener('input', update);
    clear.addEventListener('click', function () { input.value = ''; update(); input.focus(); });
    update();

    finder = {
      focusItem: function (i, q) {
        input.value = q || ''; state.area = '';
        update(); goTo('quem-procurar');
        setTimeout(function () { var c = cards[i]; if (c) flash(c.node); }, 500);
      }
    };

    return el('section', 'tf-section tf-reveal', { id: 'quem-procurar', 'aria-label': 'Quem procurar — Pontos Focais CSC' }, [
      secHead('Pontos Focais CSC', 'contact_support', 'Quem procurar?', 'Encontre quem orienta, tira dúvidas e encaminha cada assunto do Centro de Serviços Compartilhados.'),
      el('div', 'tf-steps', null, [
        el('div', 'tf-step', null, [el('b', null, { text: '1' }), el('div', null, null, [el('strong', null, { text: PF.passos[0].titulo }), el('span', null, { text: PF.passos[0].texto })])]),
        el('span', 'tf-step-arrow', { 'aria-hidden': 'true' }, [icon('arrow_forward')]),
        el('div', 'tf-step', null, [el('b', null, { text: '2' }), el('div', null, null, [el('strong', null, { text: PF.passos[1].titulo }), el('span', null, { text: PF.passos[1].texto })])])
      ]),
      el('div', 'tf-finder', null, [
        el('div', 'tf-finder-tools', null, [el('div', 'tf-search', null, [el('div', 'tf-search-field', null, [icon('search'), input, clear])]), chips]),
        grid, empty
      ])
    ]);
  }

  /* ---------- quem aprova ---------- */
  var validating = AL.status !== 'vigente';
  function statusChip() { return el('span', 'tf-status ' + (validating ? 'is-validating' : 'is-live'), { text: validating ? 'Em validação' : 'Vigente' }); }
  function ruleRow(r, q, alt) {
    var changed = r.anterior && r.anterior !== r.aprovador;
    var who = r.aprovador.split(/\s+ou\s+/);
    return el('div', 'tf-rule' + (alt ? ' is-alt' : ''), null, [
      el('div', 'tf-rule-cc', null, [el('span', 'tf-rule-lbl', { text: 'Centro de custo' }), el('strong', null, null, [highlight(r.centroCusto, q || '')])]),
      el('div', 'tf-rule-before', null, [el('span', 'tf-rule-lbl', { text: 'Antes' }), changed ? el('span', null, null, [highlight(r.anterior, q || '')]) : el('span', 'tf-rule-same', { text: 'Sem alteração' })]),
      el('span', 'tf-rule-arrow', { 'aria-hidden': 'true' }, [icon('arrow_forward')]),
      el('div', 'tf-rule-who', null, [
        el('span', 'tf-rule-avs', { 'aria-hidden': 'true' }, who.map(function (w) { return el('span', 'tf-avatar', { text: initials(w) }); })),
        el('div', null, null, [el('span', 'tf-rule-lbl', { text: 'Aprova agora' }), el('strong', null, { title: r.aprovador }, [highlight(r.aprovador.replace(/\s+ou\s+/, ' / '), q || '')])])
      ])
    ]);
  }
  function approveSection() {
    var systems = AL.sistemas || [{ nome: 'FlyTour', ativo: true }];
    var panel = el('div', 'tf-ap-panel', { role: 'tabpanel' });
    var tabs = el('div', 'tf-ap-tabs', { role: 'tablist', 'aria-label': 'Sistemas' });
    function compareCard(kind, title, ic, items) {
      return el('div', 'tf-ap-col is-' + kind, null, [
        el('div', 'tf-ap-col-head', null, [el('span', 'tf-ap-col-ic', { 'aria-hidden': 'true' }, [icon(ic)]), el('strong', null, { text: title })]),
        el('ol', 'tf-ap-list', null, (items || []).map(function (f, i) { return el('li', null, null, [el('b', null, { text: String(i + 1) }), el('span', null, { text: f.texto || f })]); }))
      ]);
    }
    function show(s) {
      [].forEach.call(tabs.children, function (b) { b.setAttribute('aria-selected', b._s === s ? 'true' : 'false'); });
      panel.innerHTML = '';
      panel.appendChild(el('div', 'tf-ap-head', null, [
        el('div', 'tf-ap-title', null, [el('h3', null, { text: 'Alçadas na ' + s.nome }), statusChip()]),
        AL.documento ? el('a', 'tf-btn tf-btn--ghost', assign({ href: AL.documento }, ext(AL.documento)), ['Documento oficial', icon('north_east')]) : null
      ]));
      panel.appendChild(el('div', 'tf-ap-compare', null, [
        compareCard('before', 'Como funcionava', 'history', AL.comoFunciona),
        el('span', 'tf-ap-arrow', { 'aria-hidden': 'true' }, [icon('arrow_forward')]),
        compareCard('now', 'Como funciona agora', 'task_alt', AL.agora)
      ]));
      panel.appendChild(el('button', 'tf-ap-cta', { type: 'button', onclick: function () { openRules(''); } }, [
        el('span', 'tf-ap-cta-ic', { 'aria-hidden': 'true' }, [icon('search')]),
        el('span', 'tf-ap-cta-text', null, [el('strong', null, { text: 'Quem aprova as viagens do meu centro de custo?' }), el('span', null, { text: 'Busque pelo seu centro de custo e veja quem aprova agora.' })]),
        el('span', 'tf-btn', { 'aria-hidden': 'true' }, ['Consultar alçadas', icon('arrow_forward')])
      ]));
    }
    var first = null;
    systems.forEach(function (s) {
      var b = el('button', 'tf-ap-tab', { type: 'button', role: 'tab', 'aria-selected': 'false', disabled: s.ativo ? null : '' , onclick: function () { show(s); } }, [
        el('strong', null, { text: s.nome }),
        el('span', null, { text: s.ativo ? (validating ? 'Em validação' : 'Vigente') : 'Em mapeamento' })
      ]);
      b._s = s; tabs.appendChild(b);
      if (s.ativo && !first) first = s;
    });
    if (first) show(first);
    return el('section', 'tf-section tf-reveal', { id: 'quem-aprova', 'aria-label': 'Quem aprova — Alçadas de Aprovação' }, [
      secHead('Alçadas de Aprovação', 'verified_user', 'Quem aprova?', 'Consulte as alçadas de aprovação para entender quem deve aprovar cada tipo de solicitação.'),
      el('div', 'tf-card tf-ap', null, [tabs, panel])
    ]);
  }

  /* ---------- políticas (carrossel) ---------- */
  var TAG = { 'nova': 'Nova', 'atualizada': 'Atualizada', 'importante': 'Importante', 'em-revisao': 'Em revisão' };
  function railNav(rail) {
    function step(dir) { var c = rail.querySelector(':scope > :not([hidden])'); var w = c ? c.getBoundingClientRect().width + 16 : 300; rail.scrollBy({ left: dir * w, behavior: 'smooth' }); }
    var prev = el('button', 'tf-icon-btn', { type: 'button', 'aria-label': 'Anterior', onclick: function () { step(-1); } }, [icon('chevron_left')]);
    var next = el('button', 'tf-icon-btn', { type: 'button', 'aria-label': 'Próximo', onclick: function () { step(1); } }, [icon('chevron_right')]);
    function upd() { prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4; }
    rail.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); setTimeout(upd, 60);
    rail._upd = upd;
    return el('div', 'tf-rail-nav', null, [prev, next]);
  }
  function policiesSection() {
    var list = D.politicas || [];
    if (!list.length) return null;
    var rail = el('div', 'tf-rail', { role: 'list' });
    var nodes = list.map(function (p) {
      var n = el('article', 'tf-card tf-policy', { role: 'listitem' }, [
        el('div', 'tf-policy-top', null, [el('span', 'tf-policy-ic', { 'aria-hidden': 'true' }, [icon('description')]), p.tag && TAG[p.tag] ? el('span', 'tf-ptag is-' + p.tag, { text: TAG[p.tag] }) : null]),
        el('span', 'tf-policy-cat', { text: p.categoria }),
        el('strong', null, { text: p.titulo }),
        el('p', null, { text: p.descricao }),
        el('div', 'tf-policy-foot', null, [
          p.atualizada ? el('span', 'tf-policy-date', { title: 'Atualizada em ' + dmy(p.atualizada) }, [icon('update'), dmy(p.atualizada)]) : el('span'),
          p.url ? el('a', 'tf-policy-cta', assign({ href: p.url }, ext(p.url)), ['Consultar', icon('north_east')]) : el('span', 'tf-policy-cta is-off', { text: 'Link a definir' })
        ])
      ]);
      n._p = p; rail.appendChild(n); return n;
    });
    var cats = []; list.forEach(function (p) { if (cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    var chips = el('div', 'tf-chips', { role: 'group', 'aria-label': 'Filtrar por categoria' });
    var cb = [];
    [''].concat(cats).forEach(function (c) {
      var b = el('button', 'tf-chip-btn', { type: 'button', 'aria-pressed': c === '' ? 'true' : 'false', onclick: function () { setCat(c); } }, [c || 'Todas']);
      b._c = c; cb.push(b); chips.appendChild(b);
    });
    function setCat(c) { cb.forEach(function (b) { b.setAttribute('aria-pressed', b._c === c ? 'true' : 'false'); }); nodes.forEach(function (n) { n.hidden = !!c && n._p.categoria !== c; }); rail.scrollLeft = 0; rail._upd && rail._upd(); }
    var nav = railNav(rail);
    policiesApi = { focus: function (i) { setCat(''); goTo('politicas'); setTimeout(function () { rail.scrollTo({ left: nodes[i].offsetLeft - 24, behavior: 'smooth' }); flash(nodes[i]); }, 450); } };
    return el('section', 'tf-section tf-reveal', { id: 'politicas', 'aria-label': 'Políticas' }, [
      secHead('Políticas e documentos', 'menu_book', 'O que mudou?', 'As políticas e documentos mais consultados, sempre na versão mais recente.',
        nav),
      chips,
      rail
    ]);
  }

  /* ---------- dúvidas ---------- */
  function faqSection() {
    var list = D.faq || [];
    var items = [];
    var ul = el('ul', 'tf-faq-list');
    list.forEach(function (f, i) {
      var li = el('li', 'tf-faq-item');
      var aid = 'tf-faq-a-' + i;
      var q = el('button', 'tf-faq-q', { type: 'button', 'aria-expanded': 'false', 'aria-controls': aid }, [el('span', null, { text: f.pergunta }), el('span', 'tf-faq-tog', { 'aria-hidden': 'true' }, [icon('add')])]);
      q.addEventListener('click', function () { toggle(i); });
      li.appendChild(q);
      li.appendChild(el('div', 'tf-faq-a', { id: aid, role: 'region' }, [el('div', null, null, [el('div', 'tf-faq-body', null, [
        el('p', null, { text: f.resposta }),
        f.acao ? el('button', 'tf-link-btn', { type: 'button', onclick: function () { if (f.acao.alvo === 'quem-aprova') openRules(''); else goTo(f.acao.alvo); } }, [f.acao.texto, icon('arrow_forward')]) : (f.url ? el('a', 'tf-link-btn', assign({ href: f.url }, ext(f.url)), ['Saiba mais', icon('north_east')]) : null)
      ])])]));
      li._f = f; li._q = q; items.push(li); ul.appendChild(li);
    });
    function toggle(i, force) {
      var li = items[i]; var on = force != null ? force : !li.classList.contains('is-open');
      li.classList.toggle('is-open', on); li._q.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    var cats = []; list.forEach(function (f) { if (f.categoria && cats.indexOf(f.categoria) < 0) cats.push(f.categoria); });
    var chips = el('div', 'tf-chips', { role: 'group', 'aria-label': 'Filtrar por tema' });
    var cb = [];
    [''].concat(cats).forEach(function (c) {
      var b = el('button', 'tf-chip-btn', { type: 'button', 'aria-pressed': c === '' ? 'true' : 'false', onclick: function () { setCat(c); } }, [c || 'Todas']);
      b._c = c; cb.push(b); chips.appendChild(b);
    });
    function setCat(c) { cb.forEach(function (b) { b.setAttribute('aria-pressed', b._c === c ? 'true' : 'false'); }); items.forEach(function (li) { li.hidden = !!c && li._f.categoria !== c; }); }
    faqApi = { open: function (i) { setCat(''); toggle(i, true); goTo('duvidas'); setTimeout(function () { flash(items[i]); }, 450); } };

    var C = D.canal || {};
    var cta = D.jotform && D.jotform.formId
      ? el('button', 'tf-btn', { type: 'button', 'aria-haspopup': 'dialog', onclick: function () { openAsk(); } }, [icon('send'), 'Enviar minha dúvida'])
      : C.canalUrl
        ? el('a', 'tf-btn', assign({ href: C.canalUrl }, ext(C.canalUrl)), [icon('send'), 'Enviar minha dúvida'])
        : el('span', 'tf-btn is-disabled', { title: 'Preencher canal em data.js' }, [icon('send'), 'Enviar minha dúvida']);
    var ask = el('aside', 'tf-card tf-ask', { 'aria-label': 'Não encontrou sua resposta?' }, [
      el('span', 'tf-ask-ic', { 'aria-hidden': 'true' }, [icon('mark_email_unread')]),
      el('div', 'tf-ask-text', null, [
        el('span', 'tf-eyebrow', { text: C.titulo }),
        el('h3', null, { text: 'Não encontrou sua resposta?' }),
        el('p', null, { text: C.texto + ' ' + C.complemento })
      ]),
      el('div', 'tf-ask-actions', null, [cta])
    ]);
    return el('section', 'tf-section tf-reveal', { id: 'duvidas', 'aria-label': 'Dúvidas frequentes' }, [
      secHead('Dúvidas', 'forum', 'Dúvidas frequentes', 'Não encontrou o que procura? Comece por aqui.'),
      el('div', 'tf-faq', null, [list.length ? chips : null, list.length ? ul : el('p', 'tf-faq-none', { text: 'As perguntas mais frequentes vão virar nosso FAQ.' }), ask])
    ]);
  }

  /* ---------- janela: alçadas ---------- */
  var modal = el('div', 'tf-modal', { hidden: '' });
  var lastFocus = null;
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true; modal.innerHTML = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function showDialog(dialog, focusEl) {
    if (modal.hidden) lastFocus = document.activeElement;
    modal.innerHTML = '';
    modal.appendChild(el('div', 'tf-modal-backdrop', { onclick: closeModal }));
    modal.appendChild(dialog);
    modal.hidden = false;
    setTimeout(function () { (focusEl || dialog).focus(); }, 30);
  }
  function openPerson(it, q) {
    var a = areaById(it.area);
    var who = it.pontoFocal || it.email;
    var contacts = [];
    var ct = it.contato || {};
    var mail = it.email || ct.email;
    if (mail) contacts.push(el('a', 'tf-contact', { href: 'mailto:' + mail }, [el('span', 'tf-contact-ic', null, [icon('mail')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'E-mail' }), el('span', 'tf-contact-val', { text: mail })])]));
    if (ct.telefone) contacts.push(el('a', 'tf-contact', { href: 'tel:' + ct.telefone.replace(/[^\d+]/g, '') }, [el('span', 'tf-contact-ic', null, [icon('call')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'Telefone' }), el('span', 'tf-contact-val', { text: ct.telefone })])]));
    if (false) contacts.push(el('a', 'tf-contact', { href: 'mailto:' + it.email }, [el('span', 'tf-contact-ic', null, [icon('mail_outline')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'E-mail' }), el('span', 'tf-contact-val', { text: it.email })])]));
    if (it.canal) contacts.push(el('div', 'tf-contact', null, [el('span', 'tf-contact-ic', null, [icon('forum')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'Canal' }), el('span', 'tf-contact-val', { text: it.canal })])]));
    if (it.backup) contacts.push(el('div', 'tf-contact', null, [el('span', 'tf-contact-ic', null, [icon('people_outline')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'Backup' }), el('span', 'tf-contact-val', { text: it.backup })])]));
    if (it.sla) contacts.push(el('div', 'tf-contact', null, [el('span', 'tf-contact-ic', null, [icon('schedule')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'SLA' }), el('span', 'tf-contact-val', { text: it.sla })])]));
    if (false) contacts.push(el('a', 'tf-contact', assign({ href: D.meta.organograma + '#csc' }, ext(D.meta.organograma)), [el('span', 'tf-contact-ic', null, [icon('account_tree')]), el('span', 'tf-contact-txt', null, [el('span', 'tf-contact-lbl', { text: 'Organograma' }), el('span', 'tf-contact-val', { text: 'Ver no Organograma zhouse' })])]));
    var dialog = el('div', 'tf-dialog is-person', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tf-dlg-title', tabindex: '-1' }, [
      el('button', 'tf-close', { type: 'button', 'aria-label': 'Fechar', onclick: closeModal }, [icon('close')]),
      el('div', 'tf-person-head', null, [
        it.email ? el('span', 'tf-avatar is-mail', { 'aria-hidden': 'true' }, [icon('alternate_email')]) : el('span', 'tf-avatar', { 'aria-hidden': 'true', text: initials(who) }),
        el('h2', null, { id: 'tf-dlg-title', text: who }),
        el('p', null, { text: (it.email ? 'Caixa de atendimento · ' : 'Ponto focal · ') + a.nome })
      ]),
      el('div', 'tf-dialog-body', { style: 'gap:20px' }, [
        el('div', 'tf-dlg-sec', null, [el('span', 'tf-dlg-label', { text: 'Frentes de serviço' }), el('ul', 'tf-fronts', null, it.frentes.map(function (f) {
          var t = el('li', q && matches(f, q) ? 'is-match' : null, null, [icon('check')]); var s = el('span'); s.appendChild(highlight(f, q || '')); t.appendChild(s); return t;
        }))]),
        contacts.length ? el('div', 'tf-dlg-sec', null, [el('span', 'tf-dlg-label', { text: 'Contato' }), el('div', 'tf-contacts', null, contacts)]) : el('p', 'tf-empty', { text: 'Contatos ainda não cadastrados.' }),
        el('div', 'tf-dlg-sec', null, [el('span', 'tf-dlg-label', { text: 'Liderança responsável pela área' }), it.responsavel ? el('strong', null, { text: it.responsavel }) : el('span', null, null, [el('span', 'tf-ph', { text: 'a definir' })])]),
        el('div', 'tf-pf-note', null, [el('span', 'tf-pf-note-ic', { 'aria-hidden': 'true' }, [icon('info_outline')]), el('div', null, null, [el('strong', null, { text: 'O que é um ponto focal?' }), el('p', null, { text: PF.orientacao })])])
      ])
    ]);
    showDialog(dialog);
  }
  function openRules(q) {
    var input = el('input', null, { type: 'search', placeholder: 'Busque seu centro de custo ou um aprovador', 'aria-label': 'Buscar centro de custo', autocomplete: 'off' });
    input.value = q || '';
    var body = el('div', 'tf-dialog-body');
    var empty = el('p', 'tf-empty', { text: 'Nenhum centro de custo encontrado.', style: 'padding:16px 14px', hidden: '' });
    function render() {
      var v = input.value.trim();
      body.innerHTML = '';
      body.appendChild(el('div', 'tf-rule-head', { 'aria-hidden': 'true' }, [el('span', null, { text: 'Centro de custo' }), el('span', null, { text: 'Antes' }), el('span'), el('span', null, { text: 'Aprova agora' })]));
      var n = 0;
      AL.regras.forEach(function (r) { if (v && !matches(r.centroCusto + ' ' + r.aprovador + ' ' + r.anterior, v)) return; body.appendChild(ruleRow(r, v, n % 2 === 1)); n++; });
      empty.hidden = n > 0; body.appendChild(empty);
    }
    input.addEventListener('input', render);
    var dialog = el('div', 'tf-dialog', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tf-dlg-title', tabindex: '-1' }, [
      el('button', 'tf-close', { type: 'button', 'aria-label': 'Fechar', onclick: closeModal }, [icon('close')]),
      el('div', 'tf-dialog-head', null, [
        el('div', 'tf-dialog-tags', null, [el('span', 'tf-eyebrow', null, [icon('verified_user'), 'Alçadas de Aprovação · FlyTour']), statusChip()]),
        el('h2', null, { id: 'tf-dlg-title', text: 'Quem aprova as viagens do meu centro de custo?' }),
        el('div', 'tf-search-field', null, [icon('search'), input])
      ]),
      body,
      el('p', 'tf-dialog-foot', null, [icon('info'), AL.observacao || ''])
    ]);
    render();
    showDialog(dialog, input);
  }

  /* ---------- janela: enviar dúvida (Jotform) ---------- */
  var askDraft = { ident: null, nome: '', territorio: '', contato: '', duvida: '' };
  function openAsk() {
    var J = D.jotform, F = J.campos, O = J.opcoes;
    var s = askDraft, step = 1;
    var title = el('h2', null, { id: 'tf-dlg-title' });
    var stepLbl = el('span', 'tf-ask-step');
    var bar = el('span', 'tf-ask-bar', null, [el('span')]);
    var body = el('div', 'tf-dialog-body tf-askf');
    var foot = el('div', 'tf-askf-foot');
    var err = el('p', 'tf-askf-err', { role: 'alert', hidden: '' });
    function field(lbl, key, opts) {
      opts = opts || {};
      var inp = el(opts.area ? 'textarea' : 'input', 'tf-askf-input', assign({ id: 'tf-f-' + key, name: key, placeholder: opts.ph || '', autocomplete: opts.ac || 'off' }, opts.area ? { rows: '6' } : { type: 'text' }));
      inp.value = s[key];
      inp.addEventListener('input', function () { s[key] = inp.value; inp.classList.remove('is-invalid'); err.hidden = true; });
      return el('label', 'tf-askf-field', { for: 'tf-f-' + key }, [el('span', 'tf-askf-lbl', null, [lbl, el('span', 'tf-askf-req', { text: ' *', 'aria-hidden': 'true' })]), inp, opts.hint ? el('span', 'tf-askf-hint', { text: opts.hint }) : null]);
    }
    function choice(val, ic, t, sub) {
      var b = el('button', 'tf-askf-opt', { type: 'button', role: 'radio', 'aria-checked': s.ident === val ? 'true' : 'false', onclick: function () { s.ident = val; err.hidden = true; render(); } }, [
        el('span', 'tf-askf-opt-ic', { 'aria-hidden': 'true' }, [icon(ic)]),
        el('span', 'tf-askf-opt-txt', null, [el('strong', null, { text: t }), el('span', null, { text: sub })]),
        el('span', 'tf-askf-radio', { 'aria-hidden': 'true' })
      ]);
      return b;
    }
    function fail(msg, node) { err.textContent = msg; err.hidden = false; if (node) { node.classList.add('is-invalid'); node.focus(); } }
    function validate1() {
      if (!s.ident) return fail('Escolha se deseja se identificar.'), false;
      if (s.ident === 'sim') {
        var keys = ['nome', 'territorio', 'contato'];
        for (var i = 0; i < keys.length; i++) if (!s[keys[i]].trim()) return fail('Preencha os campos obrigatórios.', body.querySelector('#tf-f-' + keys[i])), false;
      }
      return true;
    }
    function render() {
      body.innerHTML = ''; foot.innerHTML = ''; err.hidden = true;
      dialog.classList.toggle('is-done', step === 3);
      if (step === 3) {
        head.hidden = true;
        body.appendChild(el('div', 'tf-askf-done', null, [
          el('span', 'tf-askf-done-ic', { 'aria-hidden': 'true' }, [icon('check')]),
          el('h2', null, { id: 'tf-dlg-title', text: 'Dúvida enviada!' }),
          el('p', null, { text: s.ident === 'sim' ? 'Recebemos sua mensagem. Vamos responder pelo contato que você informou.' : 'Recebemos sua mensagem anônima. As perguntas mais frequentes vão virar nosso FAQ, atualizado toda semana.' }),
          el('button', 'tf-btn', { type: 'button', onclick: closeModal }, ['Fechar'])
        ]));
        return;
      }
      stepLbl.textContent = 'Etapa ' + step + ' de 2';
      bar.firstChild.style.width = step === 1 ? '50%' : '100%';
      if (step === 1) {
        title.textContent = 'Identificação';
        body.appendChild(el('div', 'tf-askf-field', { role: 'radiogroup', 'aria-label': 'Você deseja se identificar?' }, [
          el('span', 'tf-askf-lbl', null, ['Você deseja se identificar?', el('span', 'tf-askf-req', { text: ' *', 'aria-hidden': 'true' })]),
          el('div', 'tf-askf-opts', null, [choice('sim', 'person_outline', 'Sim, quero me identificar', 'Assim conseguimos te responder diretamente.'), choice('nao', 'visibility_off', 'Não, prefiro enviar anonimamente', 'Sua dúvida chega sem nome nem contato.')])
        ]));
        if (s.ident === 'sim') body.appendChild(el('div', 'tf-askf-grid', null, [
          field('Nome completo', 'nome', { ac: 'name' }),
          field('Território / Operação', 'territorio'),
          el('div', 'tf-askf-span', null, [field('E-mail ou WhatsApp', 'contato', { ph: 'nome@zhouse.com.br ou (00) 00000-0000' })])
        ]));
        body.appendChild(err);
        foot.appendChild(el('span'));
        foot.appendChild(el('button', 'tf-btn', { type: 'button', onclick: function () { if (validate1()) { step = 2; render(); var t = body.querySelector('textarea'); if (t) t.focus(); } } }, ['Avançar', icon('arrow_forward')]));
      } else {
        title.textContent = 'Sua dúvida';
        body.appendChild(field('Descreva sua dúvida', 'duvida', { area: true, hint: 'Conte sua dúvida, oportunidade de melhoria ou situação que gostaria de compartilhar.' }));
        body.appendChild(err);
        foot.appendChild(el('button', 'tf-btn tf-btn--ghost', { type: 'button', onclick: function () { step = 1; render(); } }, [icon('arrow_back'), 'Voltar']));
        var send = el('button', 'tf-btn', { type: 'button', onclick: function () { submit(send); } }, [icon('send'), 'Enviar']);
        foot.appendChild(send);
      }
    }
    function submit(btn) {
      if (!s.duvida.trim()) return fail('Descreva sua dúvida antes de enviar.', body.querySelector('textarea'));
      btn.disabled = true; btn.classList.add('is-loading'); btn.lastChild.textContent = 'Enviando…';
      var name = 'tf-jf-' + Date.now();
      var frame = el('iframe', null, { name: name, title: 'envio', 'aria-hidden': 'true', tabindex: '-1', style: 'display:none' });
      var form = el('form', null, { method: 'POST', action: 'https://submit.jotform.com/submit/' + J.formId + '/', target: name, 'accept-charset': 'utf-8', style: 'display:none' });
      function add(n, v) { if (!n) return; var i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = v; form.appendChild(i); }
      add('formID', J.formId); add('simple_spc', J.formId + '-' + J.formId); add('website', '');
      add(F.identificar, s.ident === 'sim' ? O.sim : O.nao);
      if (s.ident === 'sim') {
        if (F.nome && typeof F.nome === 'object') { var p = s.nome.trim().split(/\s+/); add(F.nome.first, p.shift() || ''); add(F.nome.last, p.join(' ')); }
        else add(F.nome, s.nome.trim());
        add(F.territorio, s.territorio.trim()); add(F.contato, s.contato.trim());
      }
      add(F.duvida, s.duvida.trim());
      var done = false;
      function finish() { if (done) return; done = true; setTimeout(function () { frame.remove(); form.remove(); }, 1000); askDraft = { ident: null, nome: '', territorio: '', contato: '', duvida: '' }; step = 3; render(); }
      frame.addEventListener('load', finish);
      document.body.appendChild(frame); document.body.appendChild(form);
      form.submit();
      setTimeout(finish, 8000);
    }
    var head = el('div', 'tf-dialog-head', null, [
      el('div', 'tf-dialog-tags', null, [el('span', 'tf-eyebrow', null, [icon('mark_email_unread'), 'Transição em Foco · Suas dúvidas têm endereço']), stepLbl]),
      title, bar
    ]);
    var dialog = el('div', 'tf-dialog is-ask', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'tf-dlg-title', tabindex: '-1' }, [
      el('button', 'tf-close', { type: 'button', 'aria-label': 'Fechar', onclick: closeModal }, [icon('close')]),
      head, body, foot
    ]);
    render();
    showDialog(dialog);
  }

  /* ---------- montagem ---------- */
  root.appendChild(header());
  var main = el('main', 'tf-main tf-wrap', null, [intro(), pilaresSection(), whoSection(), approveSection(), policiesSection(), faqSection()]);
  root.appendChild(main);
  root.appendChild(modal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!modal.hidden) closeModal(); else if (!root._closeMenu()) root._closeHelp(); }
    if (e.key === '/' && modal.hidden && !/input|textarea/i.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); root._search._input.focus(); }
    if (!modal.hidden && e.key === 'Tab') {
      var f = modal.querySelectorAll('button:not([disabled]), a[href], input, textarea');
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // navegação: seção ativa + sombra da barra
  var secs = NAV.map(function (n) { return document.getElementById(n.id); }).filter(Boolean);
  function onScroll() {
    var off = (barEl ? barEl.offsetHeight : 0) + 48;
    barEl.classList.toggle('is-stuck', window.pageYOffset > 4);
    var active = secs[0] && secs[0].id;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top - off <= 0) active = s.id; });
    if (window.pageYOffset > 0 && window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4 && secs.length) active = secs[secs.length - 1].id;
    root._setSection(active);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); requestAnimationFrame(onScroll); window.addEventListener('load', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);

  // entrada sutil (com fallback para iframe oculto / aba em segundo plano)
  var reveals = root.querySelectorAll('.tf-reveal');
  function revealAll() { reveals.forEach(function (r) { r.classList.add('is-in'); }); }
  reveals.forEach(function (r) { if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('is-in'); });
  setTimeout(revealAll, 1200);
  if (document.visibilityState !== 'visible' || !('IntersectionObserver' in window)) revealAll();
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  }

  // links diretos (#quem-procurar, #quem-aprova, #politicas, #duvidas, #novidades, #alcadas abre a consulta)
  var h = (location.hash || '').slice(1);
  if (h === 'alcadas') { goTo('quem-aprova', true); openRules(''); }
  else if (h && document.getElementById(h)) setTimeout(function () { goTo(h, true); }, 0);
})();
