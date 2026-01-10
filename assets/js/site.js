(function(){
  const body = document.body;
  const nav = document.querySelector('nav.site-nav');
  const dim = document.querySelector('.nav-dim');
  const toggle = document.querySelector('.menu-toggle');

  if(!nav || !toggle) return;

  const mq = window.matchMedia('(max-width:980px)');

  function isMobile(){ return mq.matches; }

  function openNav(){
    nav.classList.add('open');
    dim?.classList.add('show');
    body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded','true');
  }

  function closeNav(){
    nav.classList.remove('open');
    dim?.classList.remove('show');
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded','false');
    nav.querySelectorAll('.has-sub.open').forEach(li=>li.classList.remove('open'));
  }

  function toggleNav(){
    if(nav.classList.contains('open')) closeNav();
    else openNav();
  }

  // 초기 상태 정리(페이지 이동/뒤로가기 캐시에서도 깨끗하게)
  function reset(){
    closeNav();
  }
  reset();
  window.addEventListener('pageshow', reset);
  window.addEventListener('resize', ()=>{ if(!isMobile()) closeNav(); });

  toggle.addEventListener('click', (e)=>{
    e.preventDefault();
    toggleNav();
  });
  dim?.addEventListener('click', closeNav);

  // 진료안내 서브메뉴 자동 생성(상대경로 안전)
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

  // ✅ 모바일: 메뉴 항목 클릭 동작 (심플)
  // - 진료안내는 "펼침/닫힘"
  // - 그 외는 "이동" + "메뉴 닫기"
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

  // reveal
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

  // doctor slider (index only)
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
