(function(){
  const body = document.body;
  const nav = document.querySelector('nav.site-nav');
  const dim = document.querySelector('.nav-dim');
  const toggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');

  if(!nav || !toggle) return;

  function isMobile(){
    return window.matchMedia('(max-width:980px)').matches;
  }

  function setExpanded(isOpen){
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeNav(){
    nav.classList.remove('open');
    dim?.classList.remove('show');
    body.classList.remove('nav-open');
    setExpanded(false);
    nav.querySelectorAll('.has-sub.open').forEach(li=>li.classList.remove('open'));
  }

  function openNav(){
    nav.classList.add('open');
    dim?.classList.add('show');
    body.classList.add('nav-open');
    setExpanded(true);
  }

  function resetNav(){ closeNav(); }
  window.addEventListener('pageshow', resetNav);

  toggle.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  closeBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    closeNav();
  });

  dim?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeNav();
  });

  // Build Treatments submenu under "진료안내"
  const tLink = document.querySelector('[data-treatments-link="true"]');
  const tLi = tLink?.closest('li');
  if(tLink && tLi){
    tLi.classList.add('has-sub');
    tLink.dataset.subtoggle = 'true';

    const href = tLink.getAttribute('href') || '';
    const base = href.replace(/index\.html$/,'');
    if(!tLi.querySelector('.submenu')){
      const submenu = document.createElement('div');
      submenu.className = 'submenu';
      submenu.innerHTML = `
        <a href="${base}implants/implant.html">임플란트</a>
        <a href="${base}tooth/tooth.html">보존/충치</a>
        <a href="${base}beauty/beauty.html">심미/미백</a>
      `;
      tLi.appendChild(submenu);
    }
  }

  // Mobile behavior: clicking "진료안내" toggles submenu, other links navigate + close
  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;

    const li = a.closest('li.has-sub');
    if(isMobile() && li && a.dataset.subtoggle === 'true'){
      e.preventDefault();
      li.classList.toggle('open');
      return;
    }

    if(isMobile()){
      closeNav();
    }
  });

  // Reveal
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
