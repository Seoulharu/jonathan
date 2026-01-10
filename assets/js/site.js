(function(){
  const body = document.body;
  const nav = document.querySelector('nav.site-nav');
  const dim = document.querySelector('.nav-dim');
  const toggle = document.querySelector('.menu-toggle');

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

  // ✅ v4: 페이지 들어올 때/뒤로가기 복원(bfcache) 때도 상태 초기화
  function resetNav(){
    closeNav();
  }
  resetNav();
  window.addEventListener('pageshow', resetNav);
  window.addEventListener('hashchange', resetNav);
  window.addEventListener('popstate', resetNav);
  window.addEventListener('resize', ()=>{
    // 모바일 → PC 전환/회전 등에서 상태 꼬임 방지
    if(!isMobile()) resetNav();
  });

  toggle.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    if(nav.classList.contains('open')) closeNav();
    else openNav();
  });

  dim?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeNav();
  });

  // ✅ v4: nav 열려있을 때만 바깥 클릭으로 닫기
  document.addEventListener('click', (e)=>{
    if(!nav.classList.contains('open')) return;
    const insideNav = e.target.closest('nav.site-nav');
    const insideToggle = e.target.closest('.menu-toggle');
    if(!insideNav && !insideToggle) closeNav();
  });

  // Treatments submenu auto-build
  const tLink = document.querySelector('[data-treatments-link="true"]');
  const tLi = tLink?.closest('li');
  if(tLink && tLi){
    tLi.classList.add('has-sub');
    tLink.dataset.subtoggle = 'true';

    const href = tLink.getAttribute('href') || '';
    const base = href.replace(/index\.html$/,'');
    const submenu = document.createElement('div');
    submenu.className = 'submenu';
    submenu.innerHTML = `
      <a href="${base}implants/implant.html">임플란트</a>
      <a href="${base}tooth/tooth.html">보존/충치</a>
      <a href="${base}beauty/beauty.html">심미/미백</a>
    `;
    // 중복 삽입 방지
    if(!tLi.querySelector('.submenu')) tLi.appendChild(submenu);
  }

  // ✅ v4: 모바일에서는 "진료안내"는 클릭 시 펼침/닫힘, 그 외 메뉴는 정상 이동 + 닫힘
  nav.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if(!a) return;

    const li = e.target.closest('li.has-sub');
    if(li && isMobile() && a.dataset.subtoggle === 'true'){
      e.preventDefault();
      li.classList.toggle('open');
      return;
    }

    if(isMobile()){
      // 링크 이동은 막지 않고, 닫기만 바로 수행
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
