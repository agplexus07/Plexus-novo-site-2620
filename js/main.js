/* =========================================================
   AGÊNCIA PLEXUS — interações e animações (GSAP 3.13)
   ========================================================= */
(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, DrawSVGPlugin, MotionPathPlugin, Draggable);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  $('.year').textContent = new Date().getFullYear();

  /* ---------- Smooth scroll ---------- */
  let smoother = null;
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (!reduce && finePointer) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: false
    });
    smoother.paused(true);
  }

  const scrollToTarget = (target, pos = 'top top') => {
    if (smoother) smoother.scrollTo(target, true, pos);
    else {
      let y = target;
      if (typeof target !== 'number') {
        const r = target.getBoundingClientRect();
        const [, vp] = pos.split(' ');
        y = pos.startsWith('center')
          ? r.top + scrollY + r.height / 2 - innerHeight * parseFloat(vp) / 100
          : r.top + scrollY;
      }
      gsap.to(window, { duration: 1.2, scrollTo: { y, autoKill: true }, ease: 'power3.inOut' });
    }
  };
  $$('[data-scroll]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    if (id === '#contato') {
      // leva direto aos botões de contato e destaca o do WhatsApp
      scrollToTarget($('.cta__btns'), 'center 62%');
      const wa = $('.cta__btns .btn');
      gsap.timeline({ delay: 1.3 })
        .to(wa, { scale: 1.12, duration: .25, ease: 'power2.out' })
        .to(wa, { scale: 1, duration: .9, ease: 'elastic.out(1, .35)' });
      return;
    }
    scrollToTarget(id === '#topo' ? 0 : $(id));
  }));

  /* ---------- Inline SVG illustrations ---------- */
  const ICONS = {
    connect: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path class="d" d="M22 74 L50 26 L78 74 Z"/><circle class="d" cx="50" cy="26" r="10" fill="var(--red)" stroke="none"/><circle class="d" cx="22" cy="74" r="10"/><circle class="d" cx="78" cy="74" r="10"/></svg>`,
    talk: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path class="d" d="M14 20 H86 V66 H44 L26 84 V66 H14 Z"/><path class="d" d="M28 36 H72" stroke="var(--red)"/><path class="d" d="M28 50 H58" stroke="var(--red)"/></svg>`,
    test: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle class="d" cx="22" cy="62" r="8"/><path class="d" d="M36 62 H52 M46 55 L53 62 L46 69"/><circle class="d" cx="76" cy="54" r="18" fill="var(--red)" stroke="none"/></svg>`,
    face: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle class="d" cx="50" cy="50" r="36"/><path class="d" d="M34 58 Q50 74 66 58" stroke="var(--red)"/><path class="d" d="M38 40 V44 M62 40 V44"/></svg>`,
    direct: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path class="d" d="M18 30 L34 18 L50 34 L66 18 L82 30" stroke-dasharray="2 6"/><circle class="d" cx="18" cy="70" r="8"/><circle class="d" cx="82" cy="70" r="8" fill="var(--red)" stroke="none"/><path class="d" d="M28 70 H72" stroke="var(--red)"/></svg>`
  };
  const VISUALS = {
    ear: `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><circle class="v" cx="60" cy="100" r="14" fill="var(--red)" stroke="none"/><path class="v" d="M90 70 Q110 100 90 130"/><path class="v" d="M112 50 Q144 100 112 150"/><path class="v" d="M134 30 Q178 100 134 170"/></svg>`,
    map: `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path class="v" d="M30 170 C 30 110, 110 140, 100 90 S 150 40, 170 30" stroke-dasharray="1 12"/><circle class="v" cx="30" cy="170" r="10"/><circle class="v" cx="100" cy="92" r="8"/><circle class="v" cx="170" cy="30" r="14" fill="var(--red)" stroke="none"/></svg>`,
    make: `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><circle class="v" cx="62" cy="62" r="36"/><rect class="v" x="104" y="26" width="72" height="72" rx="14" fill="var(--ink)" stroke="none"/><path class="v" d="M28 176 L70 110 L112 176 Z"/><circle class="v" cx="150" cy="146" r="30" fill="var(--paper)" stroke="none"/></svg>`,
    grow: `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path class="v" d="M20 180 H184"/><rect class="b" x="34" y="130" width="26" height="50" rx="4" fill="currentColor" stroke="none" opacity=".35"/><rect class="b" x="76" y="104" width="26" height="76" rx="4" fill="currentColor" stroke="none" opacity=".55"/><rect class="b" x="118" y="74" width="26" height="106" rx="4" fill="currentColor" stroke="none" opacity=".8"/><rect class="b" x="160" y="36" width="26" height="144" rx="4" fill="var(--red)" stroke="none"/><path class="v" d="M28 112 L88 80 L130 52 L176 18" stroke="var(--red)"/></svg>`
  };
  $$('[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
  $$('[data-visual]').forEach(el => { el.innerHTML = VISUALS[el.dataset.visual] || ''; });

  /* ---------- Plexo: rede interativa ---------- */
  const NODES = [
    { name: 'Estratégia', text: 'É o mapa. Antes de postar qualquer coisa, a gente define onde a sua marca quer chegar, pra quem ela fala e por quê.', ex: '<b>Exemplo:</b> descobrir que o seu público quer ver bastidores, e não só promoção.' },
    { name: 'Branding', text: 'É a sua essência virando identidade: nome, logo, cores e tom de voz. E branding é repetição: é o que faz alguém te reconhecer de longe.', ex: '<b>Exemplo:</b> um logo desenhado do zero, à mão, a partir da sua história.' },
    { name: 'Social media', text: 'É cuidar das redes da sua marca: planejamento, posts, vídeos e roteiros com discurso humano, nada robotizado. Conteúdo com a sua cara.', ex: '<b>Exemplo:</b> uma cafeteria contando a história de quem torra o café.' },
    { name: 'Tráfego pago', text: 'É investir em anúncios para que mais pessoas certas vejam você. Tipo um panfleto, só que entregue exatamente pra quem tem interesse.', ex: '<b>Exemplo:</b> mostrar o seu restaurante só para quem mora perto dele.' },
    { name: 'Direção criativa', text: 'É garantir que tudo tenha a mesma estética, da foto ao feed. A gente dirige a captação para a sua marca ficar bonita e coerente.', ex: '<b>Exemplo:</b> pensar luz, cenário e enquadramento antes de gravar.' },
    { name: 'Criação de sites', text: 'É a sua casa na internet: bonita, rápida e fácil de achar no Google. O lugar onde a pessoa entende o que você faz e já chama no WhatsApp.', ex: '<b>Exemplo:</b> um site como este, com o botão de contato sempre à vista.' }
  ];
  const stage = $('.plexo__stage');
  const svgLines = $('.plexo__lines');
  const svgWeb = $('.plexo__web');
  const svgPulses = $('.plexo__pulses');
  const nodesWrap = $('.plexo__nodes');
  const C = 300, R = 228;
  const pts = NODES.map((n, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a), a };
  });
  // teia de fundo (conexões entre todos os pontos)
  pts.forEach((p, i) => pts.forEach((q, j) => {
    if (j <= i) return;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', p.x); l.setAttribute('y1', p.y); l.setAttribute('x2', q.x); l.setAttribute('y2', q.y);
    svgWeb.appendChild(l);
  }));
  const paths = pts.map((p, i) => {
    const mx = (C + p.x) / 2, my = (C + p.y) / 2;
    const off = (i % 2 ? 1 : -1) * 46;
    const cx = mx + Math.cos(p.a + Math.PI / 2) * off, cy = my + Math.sin(p.a + Math.PI / 2) * off;
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M${C},${C} Q${cx},${cy} ${p.x},${p.y}`);
    path.id = 'plexo-path-' + i;
    svgLines.appendChild(path);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', 5); dot.setAttribute('cx', 0); dot.setAttribute('cy', 0); dot.setAttribute('opacity', 0);
    svgPulses.appendChild(dot);
    return { path, dot };
  });
  const nodeEls = NODES.map((n, i) => {
    const b = document.createElement('button');
    b.className = 'node'; b.type = 'button';
    b.style.left = (pts[i].x / 6) + '%';
    b.style.top = (pts[i].y / 6) + '%';
    b.innerHTML = `<span class="node__dot"></span><span class="node__name">${n.name}</span>`;
    b.setAttribute('aria-label', `${n.name}: ver explicação`);
    nodesWrap.appendChild(b);
    return b;
  });

  const panel = { title: $('.plexo__panel-title'), text: $('.plexo__panel-text'), ex: $('.plexo__panel-ex') };
  let activeNode = -1;
  const setNode = (i) => {
    if (i === activeNode) return;
    activeNode = i;
    nodeEls.forEach((b, k) => b.classList.toggle('is-active', k === i));
    paths.forEach(({ path }, k) => gsap.to(path, { strokeWidth: k === i ? 4 : 2, opacity: k === i || i < 0 ? 1 : .35, duration: .4 }));
    const n = NODES[i];
    gsap.timeline()
      .to([panel.title, panel.text, panel.ex], { y: -10, opacity: 0, duration: .5, stagger: .06, ease: 'power2.inOut' })
      .add(() => { panel.title.textContent = n.name; panel.text.textContent = n.text; panel.ex.innerHTML = n.ex; })
      .fromTo([panel.title, panel.text, panel.ex], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .14, ease: 'power2.out' });
    // pulso extra ao clicar
    const { path, dot } = paths[i];
    gsap.fromTo(dot, { opacity: 1 }, { duration: .7, ease: 'power2.inOut', motionPath: { path, align: path, alignOrigin: [.5, .5] }, onComplete: () => gsap.to(dot, { opacity: 0, duration: .2 }) });
    gsap.fromTo('.plexo__core', { scale: 1 }, { scale: 1.06, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out' });
  };
  let autoplay = null, userPicked = false;
  nodeEls.forEach((b, i) => {
    b.addEventListener('click', () => { userPicked = true; autoplay && autoplay.kill(); setNode(i); });
    if (finePointer) b.addEventListener('mouseenter', () => { userPicked = true; autoplay && autoplay.kill(); setNode(i); });
  });

  /* ---------- Preloader ---------- */
  const startLoader = () => new Promise(resolve => {
    const count = $('.loader__count b');
    const state = { v: 0 };
    const tl = gsap.timeline({ onComplete: resolve });
    tl.from('.loader__agencia', { y: 20, opacity: 0, duration: .6, ease: 'power3.out' })
      .from('.loader__symbol', { scale: 0, rotate: -90, duration: .9, ease: 'back.out(1.6)' }, '<.1')
      .to(state, { v: 100, duration: reduce ? .3 : 1.6, ease: 'power2.inOut', onUpdate: () => { count.textContent = Math.round(state.v); } }, '<')
      .to('.loader__symbol', { scale: 1.15, duration: .25, ease: 'power2.in' })
      .to('.loader__curtain', { scaleY: 1, duration: .7, ease: 'expo.inOut' })
      .set('.loader__inner', { opacity: 0 })
      .set('.loader', { backgroundColor: 'transparent' })
      .to('.loader__curtain', { scaleY: 0, transformOrigin: 'top', duration: .8, ease: 'expo.inOut' });
  });

  /* ---------- Hero intro ---------- */
  const heroLetters = $$('.hero__wm .wm__l');
  const heroIntro = () => {
    const title = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'line' });
    const ag = SplitText.create('.hero__agencia', { type: 'chars' });
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__wm .wm__l i', { yPercent: 105, duration: 1.4, stagger: .07 })
      .from(ag.chars, { yPercent: 100, opacity: 0, duration: .8, stagger: .03 }, '<.2')
      .from(title.lines, { yPercent: 105, duration: 1.1, stagger: .1 }, '<.3')
      .from(['.hero__sub', '.hero__ctas'], { y: 30, opacity: 0, duration: 1, stagger: .1 }, '<.2')
      .from('.hero__scroll', { opacity: 0, duration: 1 }, '<')
      .from('.nav', { yPercent: -100, opacity: 0, duration: 1 }, '<');
    return tl;
  };

  /* ---------- Hero interactions ---------- */
  const heroInteractions = () => {
    // letras reagem ao mouse
    if (finePointer) {
      const hero = $('.hero');
      const qy = heroLetters.map(l => gsap.quickTo(l, 'y', { duration: .8, ease: 'power3.out' }));
      const qr = heroLetters.map(l => gsap.quickTo(l, 'rotation', { duration: .8, ease: 'power3.out' }));
      hero.addEventListener('mousemove', e => {
        heroLetters.forEach((l, i) => {
          const b = l.getBoundingClientRect();
          const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          const f = Math.max(0, 1 - d / 420);
          qy[i](-f * 34 * Math.sign(cy - e.clientY || 1));
          qr[i](f * (e.clientX < cx ? 6 : -6));
        });
      });
      hero.addEventListener('mouseleave', () => { qy.forEach(q => q(0)); qr.forEach(q => q(0)); });
    }

    // ao rolar: letras se espalham e a hero afunda
    const mid = (heroLetters.length - 1) / 2;
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    heroLetters.forEach((l, i) => {
      tl.to(l, { xPercent: (i - mid) * 22, yPercent: (Math.abs(i - mid) + .5) * -18, ease: 'none' }, 0);
    });
    tl.to('.hero__center', { scale: 1.08, ease: 'none' }, 0)
      .to('.hero__bottom', { y: -60, opacity: 0, ease: 'none' }, 0);
  };

  /* ---------- Theme switching ---------- */
  const themes = () => {
    $$('[data-theme]').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: self => { if (self.isActive) root.dataset.theme = sec.dataset.theme; }
      });
    });
  };

  /* ---------- Marquee ---------- */
  const marquee = () => {
    const track = $('.marquee__track');
    track.innerHTML += track.innerHTML;
    const loop = gsap.to(track, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      onUpdate: self => {
        const boost = gsap.utils.clamp(1, 2.5, Math.abs(self.getVelocity()) / 1500);
        gsap.to(loop, { timeScale: self.direction * boost, duration: .4, overwrite: true });
        gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: .4 });
      }
    });
  };

  /* ---------- Split headings ---------- */
  const headings = () => {
    $$('.split-chars').forEach(h => {
      const s = SplitText.create(h, { type: 'words,chars', mask: 'words' });
      gsap.from(s.chars, {
        yPercent: 110, rotate: 8, duration: 1, ease: 'expo.out', stagger: .02,
        scrollTrigger: { trigger: h, start: 'top 85%' }
      });
    });
    $$('.tag, .lead').forEach(el => {
      if (el.closest('.hero') || el.closest('.novo__intro')) return;
      gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  };

  /* ---------- Manifesto ---------- */
  const manifesto = () => {
    const s = SplitText.create('.manifesto__text', { type: 'words', wordsClass: 'word' });
    gsap.fromTo(s.words, { opacity: .12 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
    gsap.from('.manifesto__foot p', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto__foot', start: 'top 90%' } });
  };

  /* ---------- Plexo animation ---------- */
  const plexo = () => {
    gsap.set(paths.map(p => p.path), { drawSVG: '0%' });
    gsap.set('.plexo__web line', { drawSVG: '50% 50%' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 85%', once: true } });
    tl.from('.plexo__core', { scale: 0, duration: 1, ease: 'back.out(1.7)' })
      .to(paths.map(p => p.path), { drawSVG: '100%', duration: 1, stagger: .08, ease: 'power2.inOut' }, '<.3')
      .from(nodeEls, { scale: 0, opacity: 0, duration: .6, stagger: .08, ease: 'back.out(2)' }, '<.4')
      .to('.plexo__web line', { drawSVG: '0% 100%', duration: 1.2, stagger: .02, ease: 'power2.out' }, '<.2');

    // pulsos contínuos viajando pela rede
    paths.forEach(({ path, dot }, i) => {
      gsap.timeline({ repeat: -1, delay: 1.5 + i * .45, repeatDelay: 1.2 })
        .set(dot, { opacity: 1 })
        .to(dot, { duration: 1.4, ease: 'power1.inOut', motionPath: { path, align: path, alignOrigin: [.5, .5], start: 1, end: 0 } })
        .to(dot, { opacity: 0, duration: .2 });
    });

    // a rede "respira" levemente
    gsap.to('.plexo__stage', { scale: 1.03, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // tour automático, devagar, até o usuário interagir.
    // pausa enquanto o mouse está sobre a explicação ou a rede, e quando a seção sai da tela.
    const TOUR_DELAY = 9;
    let k = 0, hovering = false, inView = false;
    const tick = () => {
      if (userPicked) return;
      if (!hovering && inView) { k = (k + 1) % NODES.length; setNode(k); }
      autoplay = gsap.delayedCall(TOUR_DELAY, tick);
    };
    ['.plexo__panel', '.plexo__stage'].forEach(sel => {
      $(sel).addEventListener('mouseenter', () => { hovering = true; });
      $(sel).addEventListener('mouseleave', () => { hovering = false; });
    });
    ScrollTrigger.create({
      trigger: '.plexo', start: 'top 70%', end: 'bottom 30%',
      onToggle: self => { inView = self.isActive; },
      onEnter: () => {
        if (autoplay || userPicked) return;
        setNode(0);
        autoplay = gsap.delayedCall(TOUR_DELAY, tick);
      }
    });
  };

  /* ---------- Horizontal "O que tem de novo" ---------- */
  const novo = () => {
    const track = $('.novo__track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.novo', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    gsap.to('.novo__progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.novo', start: 'top top', end: () => '+=' + dist(), scrub: true } });

    const intro = SplitText.create('.novo__intro .h2', { type: 'words', mask: 'words' });
    gsap.from([intro.words, '.novo__intro .lead', '.novo__intro .tag', '.novo__drag'], {
      yPercent: 100, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out',
      scrollTrigger: { trigger: '.novo', start: 'top 60%' }
    });
    gsap.to('.novo__drag', { x: 14, repeat: -1, yoyo: true, duration: .8, ease: 'sine.inOut' });

    $$('.card').forEach((card, i) => {
      gsap.from(card, {
        rotate: i % 2 ? -6 : 6, yPercent: 14, opacity: .2, ease: 'power2.out',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 55%', scrub: true }
      });
      const d = $$('.d', card);
      gsap.set(d, { drawSVG: '0%' });
      gsap.to(d, {
        drawSVG: '100%', duration: 1, stagger: .12, ease: 'power2.inOut',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 70%', toggleActions: 'play none none reverse' }
      });
      if (finePointer) {
        const rx = gsap.quickTo(card, 'rotationY', { duration: .6 });
        const ry = gsap.quickTo(card, 'rotationX', { duration: .6 });
        gsap.set(card, { transformPerspective: 900 });
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          rx(((e.clientX - r.left) / r.width - .5) * 10);
          ry(-((e.clientY - r.top) / r.height - .5) * 10);
        });
        card.addEventListener('mouseleave', () => { rx(0); ry(0); });
      }
    });
    gsap.from('.novo__end .symbol', {
      scale: .3, rotate: -60, ease: 'none',
      scrollTrigger: { trigger: '.novo__end', containerAnimation: tween, start: 'left 100%', end: 'center 50%', scrub: true }
    });
  };

  /* ---------- Antes & depois ---------- */
  const compare = () => {
    const box = $('.compare__box');
    const handle = $('.compare__handle');
    const state = { p: 50 };
    const apply = () => {
      box.style.setProperty('--pos', state.p + '%');
      handle.setAttribute('aria-valuenow', Math.round(state.p));
    };
    const setFromX = (x) => {
      const r = box.getBoundingClientRect();
      state.p = gsap.utils.clamp(0, 100, (x - r.left) / r.width * 100);
      apply();
    };
    // proxy para arrastar
    const proxy = document.createElement('div');
    Draggable.create(proxy, {
      trigger: box, type: 'x',
      onPress(e) { gsap.killTweensOf(state); setFromX(this.pointerX); },
      onDrag() { setFromX(this.pointerX); }
    });
    handle.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        gsap.to(state, { p: gsap.utils.clamp(0, 100, state.p + (e.key === 'ArrowLeft' ? -10 : 10)), duration: .4, onUpdate: apply });
      }
    });
    // demonstração ao entrar na tela
    gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 70%' } })
      .fromTo(state, { p: 92 }, { p: 12, duration: 1.4, ease: 'power3.inOut', onUpdate: apply })
      .to(state, { p: 50, duration: 1, ease: 'power3.inOut', onUpdate: apply });
    gsap.from(box, { clipPath: 'inset(12% 8% 12% 8% round 32px)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 85%' } });
  };

  /* ---------- Como funciona (cartas empilhadas) ---------- */
  const steps = () => {
    const els = $$('.step');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const last = els[els.length - 1];
      els.forEach((step, i) => {
        const top = 90 + i * 22;
        if (i < els.length - 1) {
          ScrollTrigger.create({
            trigger: step, start: `top ${top}px`,
            endTrigger: last, end: `top ${90 + (els.length - 1) * 22}px`,
            pin: true, pinSpacing: false
          });
          gsap.to(step, {
            scale: 1 - (els.length - 1 - i) * .025, filter: 'brightness(.88)', ease: 'power1.inOut',
            scrollTrigger: { trigger: els[i + 1], start: 'top 45%', end: `top ${top + 22}px`, scrub: 1.2 }
          });
        }
      });
    });
    els.forEach(step => {
      const v = $$('.v', step), b = $$('.b', step);
      gsap.set(v, { drawSVG: '0%' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 80%', once: true } });
      tl.from($('.step__num', step), { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power3.out' })
        .from($$('.step__body > *', step), { y: 24, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out' }, '<.1')
        .to(v, { drawSVG: '100%', duration: 1.1, stagger: .12, ease: 'power2.inOut' }, '<')
        .from(b, { scaleY: 0, transformOrigin: '50% 100%', duration: .8, stagger: .1, ease: 'back.out(1.6)' }, '<.3');
    });
    // shapes do passo "cria" flutuam
    $$('[data-visual="make"] .v').forEach((s, i) => gsap.to(s, { y: i % 2 ? 8 : -8, rotation: i % 2 ? 6 : -6, svgOrigin: '100 100', duration: 2 + i * .3, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
  };

  /* ---------- Galeria ---------- */
  const gallery = () => {
    $$('.ph').forEach((ph, i) => {
      const inner = $('.ph__in', ph), img = $('img', ph);
      gsap.fromTo(inner, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: ph, start: 'top 85%' }
      });
      gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, {
        yPercent: 8, scale: 1, ease: 'none',
        scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.from($('figcaption', ph), { opacity: 0, x: -20, duration: .8, scrollTrigger: { trigger: ph, start: 'top 60%' } });
    });
    const q = SplitText.create('.gallery__quote', { type: 'words', mask: 'words' });
    gsap.from(q.words, { yPercent: 100, duration: 1, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.gallery__quote', start: 'top 85%' } });
    if (smoother) {
      smoother.effects('.ph--a', { speed: 1.1 });
      smoother.effects('.ph--b', { speed: .92 });
    }
  };

  /* ---------- FAQ accordion animado ---------- */
  const faq = () => {
    $$('.qa').forEach(d => {
      const sum = $('summary', d), body = $('.qa__a', d);
      sum.addEventListener('click', e => {
        e.preventDefault();
        if (d.open) {
          gsap.to(body, { height: 0, opacity: 0, duration: .5, ease: 'power3.inOut', onComplete: () => { d.open = false; ScrollTrigger.refresh(); } });
        } else {
          d.open = true;
          gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .6, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() });
        }
      });
    });
    gsap.from('.qa', { y: 40, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 80%' } });
  };

  /* ---------- CTA + footer ---------- */
  const cta = () => {
    gsap.from('.cta__line > span', { yPercent: 110, rotate: 4, duration: 1.3, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.cta__title', start: 'top 90%', once: true } });
    gsap.from('.cta__row > *', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.cta__row', start: 'top 95%', once: true } });
    gsap.to('.cta__hl', { skewX: -8, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut' });

    gsap.from('.footer__wm .wm__l i', {
      yPercent: 105, stagger: .06, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 85%', end: 'bottom bottom', scrub: 1 }
    });
    // selo gira sozinho e acelera com a rolagem
    const seal = gsap.to('.seal__ring', { rotation: 360, transformOrigin: '50% 50%', duration: 45, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: '.footer', start: 'top bottom', end: 'bottom bottom',
      onUpdate: self => {
        gsap.to(seal, { timeScale: 1 + Math.min(1.5, Math.abs(self.getVelocity()) / 1200), duration: .3, overwrite: true });
        gsap.to(seal, { timeScale: 1, duration: 1.2, delay: .3 });
      }
    });
    gsap.from('.seal', { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true } });
    gsap.from('.footer__agencia', { opacity: 0, y: 20, scrollTrigger: { trigger: '.footer', start: 'top 80%', end: 'top 50%', scrub: true } });
  };

  /* ---------- Nav hide/show ---------- */
  const nav = () => {
    const el = $('.nav');
    let hidden = false;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const h = self.direction === 1 && self.scroll() > 400;
        if (h === hidden) return;
        hidden = h;
        gsap.to(el, { yPercent: h ? -110 : 0, duration: .6, ease: 'power3.out', overwrite: 'auto' });
      }
    });
  };

  /* ---------- Magnetic buttons ---------- */
  const magnetic = () => {
    if (!finePointer) return;
    $$('.magnetic').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(btn, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .35);
        yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  };

  /* ---------- Cursor ---------- */
  const cursor = () => {
    if (!finePointer) return;
    document.body.classList.add('has-cursor');
    const dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
    const rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3.out' });
    window.addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    const states = [
      { sel: '.node', scale: 1.6, text: '' },
      { sel: '.card', scale: 1.8, text: 'role' },
      { sel: 'a, button, summary, [role="slider"]', scale: 1.5, text: '' },
      { sel: '.ph', scale: 2, text: 'plexus' }
    ];
    document.addEventListener('mouseover', e => {
      const s = states.find(st => e.target.closest(st.sel));
      const hasLabel = !!(s && s.text);
      gsap.to(ring, { scale: s ? s.scale : 1, duration: .35 });
      gsap.to(dot, { scale: s ? 0 : 1, duration: .25 });
      $('.cursor').classList.toggle('has-label', hasLabel);
      label.textContent = s ? s.text : '';
      gsap.to(label, { opacity: hasLabel ? 1 : 0, scale: .6, duration: .25 });
    });
    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: .2 }));
    document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: .2 }));
  };

  /* ---------- Música de fundo ---------- */
  const music = () => {
    const audio = $('#bgm'), ui = $('.sound'), btn = $('.sound__btn'), vol = $('.sound__vol');
    let level = .4, wantsPlay = true;
    // sem arquivo de música (ex.: não enviado ao GitHub), o player some
    const hideIfMissing = () => ui.remove();
    audio.addEventListener('error', hideIfMissing);
    if (audio.error) hideIfMissing();
    try { const v = localStorage.getItem('plexus-vol'); if (v !== null) level = +v; } catch (e) {}
    vol.value = Math.round(level * 100);
    // iPhone/iPad ignoram audio.volume (o volume é o dos botões do aparelho): lá o controle deslizante some
    const fixedVolume = (() => { const t = new Audio(); t.volume = .5; return t.volume !== .5; })();
    if (fixedVolume) ui.classList.add('is-fixed');
    const out = { v: 0 };
    const apply = () => { audio.volume = out.v; };
    const paint = () => {
      vol.style.setProperty('--v', vol.value + '%');
      const on = !audio.paused && level > 0;
      ui.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', on);
      btn.setAttribute('aria-label', on ? 'Pausar música' : 'Tocar música');
    };
    const play = () => {
      gsap.killTweensOf(out);
      out.v = 0; apply();
      return audio.play().then(() => {
        gsap.to(out, { v: level, duration: 2.5, ease: 'power1.out', onUpdate: apply });
        paint();
      });
    };
    // navegadores bloqueiam som antes da primeira interação: tenta já e, se bloqueado, toca no 1º toque/clique/tecla.
    // No celular só o fim do toque (touchend/click) libera o som, então os ouvintes ficam até a música tocar de fato.
    const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
    const drop = () => GESTURES.forEach(ev => window.removeEventListener(ev, unlock, true));
    const unlock = e => {
      if (ui.contains(e.target)) return; // o próprio player cuida do toque nele
      if (!wantsPlay || !audio.paused) { drop(); return; }
      play().then(drop).catch(() => {});
    };
    const start = () => {
      if (audio.error) { hideIfMissing(); return; }
      if (!ui.isConnected) return;
      ui.classList.add('is-ready');
      play().catch(() => {
        GESTURES.forEach(ev => window.addEventListener(ev, unlock, { capture: true, passive: true }));
        paint();
      });
    };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (audio.paused) {
        wantsPlay = true;
        if (level === 0) { level = .4; vol.value = 40; }
        play().then(drop).catch(() => {});
      } else {
        wantsPlay = false;
        drop();
        gsap.killTweensOf(out);
        gsap.to(out, { v: 0, duration: .4, onUpdate: apply, onComplete: () => { audio.pause(); paint(); } });
      }
    });
    vol.addEventListener('input', () => {
      level = vol.value / 100;
      gsap.killTweensOf(out);
      out.v = level; apply();
      try { localStorage.setItem('plexus-vol', level); } catch (e) {}
      if (audio.paused && level > 0) { wantsPlay = true; play().then(drop).catch(() => {}); }
      paint();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) audio.pause();
      else if (wantsPlay && ui.classList.contains('is-ready')) {
        audio.play().catch(() => {});
      }
      paint();
    });
    paint();
    return start;
  };
  const startMusic = music();

  /* ---------- Agenda: abre o agendamento do Google Agenda numa janela por cima do site ---------- */
  const agenda = () => {
    const modal = $('.agenda'), frame = $('.agenda__frame'), panel = $('.agenda__panel');
    const triggers = $$('[data-agenda]').filter(a => /^https:\/\//.test(a.dataset.agenda));
    if (!triggers.length) return; // sem link de incorporação: o botão só abre a agenda em nova aba
    let last = null;
    const close = () => {
      gsap.to(modal, { autoAlpha: 0, duration: .3, onComplete: () => {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (smoother) smoother.paused(false);
        if (last) last.focus();
      } });
    };
    const open = src => {
      if (!frame.src) frame.src = src;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (smoother) smoother.paused(true);
      gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 });
      gsap.fromTo(panel, { y: 40, scale: .97 }, { y: 0, scale: 1, duration: .6, ease: 'power3.out' });
      $('.agenda__close').focus();
    };
    triggers.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      last = a;
      open(a.dataset.agenda);
    }));
    $$('[data-agenda-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  };

  /* ---------- Boot ---------- */
  const build = () => {
    heroInteractions();
    marquee();
    headings();
    manifesto();
    plexo();
    novo();
    compare();
    steps();
    gallery();
    faq();
    cta();
    nav();
    magnetic();
    cursor();
    agenda();
    themes();
    // recalcula na ordem da página (por causa das seções fixadas)
    ScrollTrigger.sort();
  };

  const boot = async () => {
    try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]); } catch (e) {}
    build();
    const intro = heroIntro().pause();
    await startLoader();
    $('.loader').remove();
    document.body.classList.remove('is-loading');
    if (smoother) smoother.paused(false);
    ScrollTrigger.refresh();
    intro.play();
    startMusic();
  };

  if (reduce) {
    gsap.globalTimeline.timeScale(4);
  }
  boot();
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
