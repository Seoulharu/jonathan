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
    if (mobileLogo) mobileLogo.style.display = 'flex';
    document.body.classList.add('nav-open');
    document.body.style.top = `-${scrollY}px`;
  }

  function closeNav() {
    if (!isNavOpen) return;
    isNavOpen = false;
    header.classList.remove('open');
    navDim.classList.remove('show');
    if (mobileLogo) mobileLogo.style.display = 'none';
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
    // 터치 이벤트 추가
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
  // =========================================================
  
  function isMobile() {
    return window.innerWidth <= 980;
  }

  lnbItems.forEach(function(item) {
    const link = item.querySelector(':scope > a');
    const arrow = link ? link.querySelector('span') : null;
    const subMenu = item.querySelector(':scope > ul');
    
    if (link && subMenu && arrow) {
      // 화살표(span) 클릭 시 하위메뉴 토글
      arrow.addEventListener('click', function(e) {
        if (isMobile()) {
          e.preventDefault();
          e.stopPropagation();
          lnbItems.forEach(function(otherItem) {
            if (otherItem !== item) otherItem.classList.remove('active');
          });
          item.classList.toggle('active');
        }
      });
      
      // 메인 링크 클릭 시 페이지 이동
      link.addEventListener('click', function(e) {
        if (isMobile() && e.target === arrow) {
          e.preventDefault();
        } else if (isMobile()) {
          setTimeout(closeNav, 100);
        }
      });
    }
  });

  // 서브메뉴 링크 클릭시 메뉴 닫기
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
