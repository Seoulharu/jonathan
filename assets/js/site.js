/* =========================================================
   서울하루치과 JavaScript
   ========================================================= */

(function() {
  "use strict";

  const header = document.querySelector('header');
  const menuBut = document.getElementById('menu_but');
  const nav = document.querySelector('header nav');
  const navDim = document.querySelector('.nav-dim');
  const lnbItems = document.querySelectorAll('header nav .lnb > li');
  const mobileLogo = document.querySelector('.mobile-logo');

  let scrollY = 0;
  let isNavOpen = false;

  // =========================================================
  // MOBILE MENU
  // =========================================================
  
  function openNav() {
    if (isNavOpen) return;
    isNavOpen = true;
    scrollY = window.scrollY || window.pageYOffset || 0;
    header.classList.add('open');
    navDim.classList.add('show');
    document.body.classList.add('nav-open');
    document.body.style.top = `-${scrollY}px`;
  }

  function closeNav() {
    if (!isNavOpen) return;
    isNavOpen = false;
    header.classList.remove('open');
    navDim.classList.remove('show');
    lnbItems.forEach(item => item.classList.remove('active'));
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function toggleNav() {
    isNavOpen ? closeNav() : openNav();
  }

  if (menuBut) {
    menuBut.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    });
    menuBut.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    }, { passive: false });
  }

  if (navDim) {
    navDim.addEventListener('click', closeNav);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isNavOpen) closeNav();
  });

  // =========================================================
  // MOBILE SUBMENU TOGGLE
  // 모바일에서 메인 메뉴 클릭 시 하위메뉴만 토글 (페이지 이동 X)
  // =========================================================
  
  function isMobile() {
    return window.innerWidth <= 980;
  }

  lnbItems.forEach(function(item) {
    const link = item.querySelector(':scope > a');
    const subMenu = item.querySelector(':scope > ul');
    
    if (link && subMenu) {
      link.addEventListener('click', function(e) {
        if (isMobile()) {
          e.preventDefault();
          // 다른 메뉴 닫기
          lnbItems.forEach(function(otherItem) {
            if (otherItem !== item) otherItem.classList.remove('active');
          });
          // 현재 메뉴 토글
          item.classList.toggle('active');
        }
      });
    }
  });

  // 서브메뉴 링크 클릭시 메뉴 닫고 페이지 이동
  const subLinks = document.querySelectorAll('header nav .lnb > li > ul > li > a');
  subLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (isMobile()) setTimeout(closeNav, 100);
    });
  });

  window.addEventListener('resize', function() {
    if (!isMobile() && isNavOpen) closeNav();
  });

  // =========================================================
  // HEADER SCROLL EFFECT
  // =========================================================
  
  function handleScroll() {
    if (isNavOpen) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================
  // SWIPER INITIALIZATION
  // =========================================================
  
  function initSwiper() {
    const swiperEl = document.querySelector('.main_visual .swiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;

    new Swiper(swiperEl, {
      loop: true,
      speed: 1000,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.main_visual .swiper-pagination', type: 'fraction' },
      navigation: { nextEl: '.main_visual .swiper-button-next', prevEl: '.main_visual .swiper-button-prev' },
      scrollbar: { el: '.main_visual .swiper-scrollbar' },
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper);
  } else {
    initSwiper();
  }

  // =========================================================
  // AOS (Animate On Scroll)
  // =========================================================
  
  function initAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');
    if (!aosElements.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(function() {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    aosElements.forEach(function(el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
  } else {
    initAOS();
  }

})();
