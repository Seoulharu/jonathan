(function(){
  const body = document.body;
  const nav = document.querySelector('nav.site-nav');
  const dim = document.querySelector('.nav-dim');
  const toggle = document.querySelector('.menu-toggle');

  function openNav(){
    if(!nav) return;
    nav.classList.add('open');
    dim?.classList.add('show');
    body.classList.add('nav-open');
  }
  function closeNav(){
    if(!nav) return;
    nav.classList.remove('open');
    dim?.classList.remove('show');
    body.classList.remove('nav-open');
    // close submenus
    nav.querySelectorAll('.has-sub.open').forEach(li=>li.classList.remove('open'));
  }

  toggle?.addEventListener('click', ()=>{
    if(nav.classList.contains('open')) closeNav();
    else openNav();
  });
  dim?.addEventListener('click', closeNav);

  // Close nav on link click (mobile)
  nav?.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;
    const li = e.target.closest('li.has-sub');
    // Mobile submenu toggle
    if(li && window.matchMedia('(max-width:980px)').matches && a.dataset.subtoggle === 'true'){
      e.preventDefault();
      li.classList.toggle('open');
      return;
    }
    if(window.matchMedia('(max-width:980px)').matches) closeNav();
  });

  // Treatments submenu auto-build
  const tLink = document.querySelector('[data-treatments-link="true"]');
  const tLi = tLink?.closest('li');
  if(tLink && tLi){
    tLi.classList.add('has-sub');
    // In mobile: clicking "진료안내" toggles submenu
    tLink.dataset.subtoggle = 'true';

    const href = tLink.getAttribute('href') || '';
    const base = href.replace(/index\.html$/,''); // ends with treatments/
    const submenu = document.createElement('div');
    submenu.className = 'submenu';
    submenu.innerHTML = `
      <a href="${base}implants/implant.html">임플란트</a>
      <a href="${base}tooth/tooth.html">보존/충치</a>
      <a href="${base}beauty/beauty.html">심미/미백</a>
    `;
    tLi.appendChild(submenu);
  }

  // Reveal on scroll (unobserve after visible)
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
    const show = (i)=>{
      slides.forEach((s,k)=>s.classList.toggle('active', k===i));
    };
    const prevBtn = document.querySelector('[data-doctor-prev]');
    const nextBtn = document.querySelector('[data-doctor-next]');
    prevBtn?.addEventListener('click', ()=>{
      idx = (idx - 1 + slides.length) % slides.length;
      show(idx);
    });
    nextBtn?.addEventListener('click', ()=>{
      idx = (idx + 1) % slides.length;
      show(idx);
    });
    show(idx);
  }
})();
