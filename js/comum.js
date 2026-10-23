/* =========================================================
   AGÊNCIA PLEXUS: base comum a todas as páginas (GSAP 3.13)
   ========================================================= */
window.Plexus = (() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, DrawSVGPlugin, MotionPathPlugin, Draggable);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  $$('.year').forEach(el => { el.textContent = new Date().getFullYear(); });

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

  /* ---------- Theme switching ---------- */
  const themes = () => {
    $$('[data-theme]').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: self => { if (self.isActive) root.dataset.theme = sec.dataset.theme; }
      });
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
      if (el.closest('.hero, .svc-hero, .novo__intro')) return;
      gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
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
    // ao trocar de página, a música continua de onde parou (e quem pausou continua sem música)
    try {
      if (sessionStorage.getItem('plexus-off') === '1') wantsPlay = false;
      const t = +sessionStorage.getItem('plexus-t');
      if (t) {
        const seek = () => { audio.currentTime = t; };
        if (audio.readyState >= 1) seek(); else audio.addEventListener('loadedmetadata', seek, { once: true });
      }
    } catch (e) {}
    window.addEventListener('pagehide', () => {
      try {
        sessionStorage.setItem('plexus-t', audio.currentTime);
        sessionStorage.setItem('plexus-off', wantsPlay ? '0' : '1');
      } catch (e) {}
    });
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
      if (!wantsPlay) { paint(); return; }
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

  return { $, $$, root, reduce, finePointer, smoother, scrollToTarget, themes, headings, faq, cta, nav, magnetic, cursor, music, agenda };
})();
