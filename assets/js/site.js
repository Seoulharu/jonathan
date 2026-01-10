(function(){
  const body = document.body;
  const nav = document.querySelector('nav.site-nav');
  const dim = document.querySelector('.nav-dim');
  const toggle = document.querySelector('.menu-toggle');
  if(!nav || !toggle) return;

  function setExpanded(open){
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeNav(){
    nav.classList.remove('open');
    dim?.classList.remove('show');
    body.classList.remove('nav-open');
    setExpanded(false);
  }
  function openNav(){
    nav.classList.add('open');
    dim?.classList.add('show');
    body.classList.add('nav-open');
    setExpanded(true);
  }

  // Init (bfcache 대응)
  closeNav();
  window.addEventListener('pageshow', closeNav);
  window.addEventListener('resize', ()=>{
    // PC로 전환 시 오버레이 정리
    if(window.matchMedia('(min-width:981px)').matches) closeNav();
  });

  toggle.addEventListener('click', (e)=>{
    e.preventDefault();
    if(nav.classList.contains('open')) closeNav();
    else openNav();
  });

  dim?.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeNav(); });

  // 모바일에서 링크 클릭 시 닫기 (submenu는 항상 펼쳐짐)
  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    if(window.matchMedia('(max-width:980px)').matches){
      closeNav();
    }
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(el=>io.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  // Doctor slider (index only)
  const slides = Array.from(document.querySelectorAll('.doctor-slide'));
  if(slides.length){
    let idx = 0;
    const show = (i)=> slides.forEach((s,k)=>s.classList.toggle('active', k===i));
    document.querySelector('[data-doctor-prev]')?.addEventListener('click', ()=>{
      idx = (idx - 1 + slides.length) % slides.length;
      show(idx);
    });
    document.querySelector('[data-doctor-next]')?.addEventListener('click', ()=>{
      idx = (idx + 1) % slides.length;
      show(idx);
    });
    show(idx);
  }
})();
