/* =========================================================
   AGÊNCIA PLEXUS: páginas de serviço (usa a base de js/comum.js)
   ========================================================= */
(() => {
  const { $$, smoother, themes, headings, faq, cta, nav, magnetic, cursor, music, agenda } = window.Plexus;
  const startMusic = music();

  const intro = () => {
    const title = SplitText.create('.svc-hero__title', { type: 'lines', mask: 'lines' });
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(title.lines, { yPercent: 105, duration: 1.2, stagger: .08 })
      .from(['.crumbs', '.svc-hero .tag', '.svc-hero__row > *'], { y: 24, opacity: 0, duration: 1, stagger: .08 }, '<.2')
      .from('.nav', { yPercent: -100, opacity: 0, duration: 1 }, '<');
  };

  // blocos entram em sequência ao aparecer na tela
  const reveals = () => {
    $$('.svc-reveal').forEach(group => {
      gsap.from(group.children, { y: 40, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 85%' } });
    });
    gsap.from('.svc-think', { y: 30, rotate: -1.5, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.svc-think', start: 'top 90%' } });
  };

  const boot = async () => {
    try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]); } catch (e) {}
    headings();
    reveals();
    faq();
    cta();
    nav();
    magnetic();
    cursor();
    agenda();
    themes();
    ScrollTrigger.sort();
    document.body.classList.remove('is-loading');
    if (smoother) smoother.paused(false);
    ScrollTrigger.refresh();
    intro();
    startMusic();
  };

  boot();
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
