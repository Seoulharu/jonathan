/* =========================================================
   서울하루치과 - 진솔한치과 벤치마킹 JavaScript
   - 모바일 햄버거 메뉴 (오프캔버스)
   - PC 드롭다운 안정화
   - 스크롤 애니메이션
   ========================================================= */

(function() {
  "use strict";

  // DOM Elements
  const header = document.querySelector('header');
  const menuBut = document.getElementById('menu_but');
  const nav = document.querySelector('header nav');
  const navDim = document.querySelector('.nav-dim');
  const lnbItems = document.querySelectorAll('header nav .lnb > li');

  // Variables
  let scrollY = 0;
  let isNavOpen = false;

  // =========================================================
  // MOBILE MENU - 오프캔버스
  // =========================================================
  
  function openNav() {
    if (isNavOpen) return;
    isNavOpen = true;
    
    // 현재 스크롤 위치 저장
    scrollY = window.scrollY || window.pageYOffset || 0;
    
    // 메뉴 열기
    header.classList.add('open');
    navDim.classList.add('show');
    
    // body 스크롤 잠금
    document.body.classList.add('nav-open');
    document.body.style.top = `-${scrollY}px`;
  }

  function closeNav() {
    if (!isNavOpen) return;
    isNavOpen = false;
    
    // 메뉴 닫기
    header.classList.remove('open');
    navDim.classList.remove('show');
    
    // 서브메뉴 모두 닫기
    lnbItems.forEach(item => item.classList.remove('active'));
    
    // body 스크롤 복원
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function toggleNav() {
    if (isNavOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  // 햄버거 버튼 클릭
  if (menuBut) {
    menuBut.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleNav();
    });
  }

  // 딤 클릭시 닫기
  if (navDim) {
    navDim.addEventListener('click', closeNav);
  }

  // ESC 키로 닫기
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isNavOpen) {
      closeNav();
    }
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
          
          // 다른 메뉴 닫기
          lnbItems.forEach(function(otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // 현재 메뉴 토글
          item.classList.toggle('active');
        }
      });
      
      // 메인 링크 클릭 시 해당 페이지로 이동 (모바일에서도)
      link.addEventListener('click', function(e) {
        if (isMobile()) {
          // span(화살표) 클릭이 아니면 링크 이동 허용
          if (e.target === arrow) {
            e.preventDefault();
          } else {
            // 링크로 이동 (기본 동작)
            setTimeout(closeNav, 100);
          }
        }
      });
    }
  });

  // 서브메뉴 링크 클릭시 메뉴 닫기 (실제 이동)
  const subLinks = document.querySelectorAll('header nav .lnb > li > ul > li > a');
  subLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (isMobile()) {
        // 약간의 딜레이 후 닫기 (링크 이동 전)
        setTimeout(closeNav, 100);
      }
    });
  });

  // 창 크기 변경시 모바일 메뉴 닫기
  window.addEventListener('resize', function() {
    if (!isMobile() && isNavOpen) {
      closeNav();
    }
  });

  // =========================================================
  // HEADER SCROLL EFFECT
  // =========================================================
  
  function handleScroll() {
    if (isNavOpen) return;
    
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // 초기 실행

  // =========================================================
  // SWIPER INITIALIZATION (메인 히어로)
  // =========================================================
  
  function initSwiper() {
    const swiperEl = document.querySelector('.main_visual .swiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;

    new Swiper(swiperEl, {
      loop: true,
      speed: 1000,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.main_visual .swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.main_visual .swiper-button-next',
        prevEl: '.main_visual .swiper-button-prev',
      },
      scrollbar: {
        el: '.main_visual .swiper-scrollbar',
      },
    });
  }

  // Swiper 로드 대기 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper);
  } else {
    initSwiper();
  }

  // =========================================================
  // AOS (Animate On Scroll) - 간단 구현
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
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // AOS 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
  } else {
    initAOS();
  }

  // =========================================================
  // REVEAL ANIMATION (IntersectionObserver)
  // =========================================================
  
  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  // =========================================================
  // SMOOTH SCROLL (앵커 링크)
  // =========================================================
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // 모바일 메뉴 닫기
        if (isNavOpen) {
          closeNav();
        }
      }
    });
  });

  // =========================================================
  // PARALLAX EFFECT (Fix BG)
  // =========================================================
  
  function initParallax() {
    const fixBgElements = document.querySelectorAll('.fix_bg');
    if (!fixBgElements.length || window.innerWidth < 1024) return;

    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      
      fixBgElements.forEach(function(el) {
        const rate = scrolled * -0.3;
        el.style.backgroundPositionY = rate + 'px';
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

})();
