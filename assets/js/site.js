/* 서울하루치과 - 벤치마킹 스타일 v10 */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const dim = document.querySelector(".nav-dim");
  const toggle = document.querySelector(".menu-toggle");


  // 모바일에서 배경 스크롤 잠금 (iOS 포함)
  let _scrollY = 0;
  function lockScroll() {
    _scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("nav-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${_scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }
  function unlockScroll() {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.remove("nav-open");
    const y = _scrollY;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, y);
  }
  function openNav() {
    if (!nav || !dim || !toggle) return;
    nav.classList.add("open");
    dim.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
    lockScroll();
  }

  function closeNav() {
    if (!nav || !dim || !toggle) return;
    nav.classList.remove("open");
    dim.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");

    // 펼쳐진 서브메뉴도 정리
    nav.querySelectorAll(".gnb > li.open").forEach((li) => li.classList.remove("open"));
    unlockScroll();
  }

  function isMobile() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  // 햄버거 열고/닫기: 클릭으로만 동작 (스와이프 없음)
  if (toggle && nav && dim) {
    toggle.addEventListener("click", () => {
      if (nav.classList.contains("open")) closeNav();
      else openNav();
    });
    dim.addEventListener("click", closeNav);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // 모바일에서 드롭다운 토글 (상단 링크 클릭 시 펼침/닫힘)
  const hasSub = document.querySelectorAll(".gnb > li.has-sub");
  hasSub.forEach((li) => {
    const a = li.querySelector(":scope > a");
    if (!a) return;

    a.addEventListener("click", (e) => {
      if (!isMobile()) return; // PC는 hover
      // 모바일: 상단을 누르면 펼치기/접기
      e.preventDefault();
      li.classList.toggle("open");
    });
  });

  // 모바일: 메뉴 안에서 실제 링크 클릭하면 닫기 (상단 토글 링크 제외)
  if (nav) {
    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      if (!isMobile()) return;

      const parentLi = link.closest("li.has-sub");
      // 상단 토글 링크면 닫지 않음(토글만)
      if (parentLi && parentLi.querySelector(":scope > a") === link) return;

      // 실제 이동 링크면 닫기
      closeNav();
    });
  }

  
  // PC로 전환될 때(가로로 넓어질 때) 모바일 메뉴 강제 닫기
  window.addEventListener("resize", () => {
    if (!isMobile()) closeNav();
  });

// 스크롤 시 헤더 약간 더 진하게(벤치마킹 느낌)
  function onScroll() {
    if (!header) return;
    if (document.body.classList.contains("nav-open")) return;
    if (window.scrollY > 8) header.style.background = "rgba(255,255,255,.97)";
    else header.style.background = "rgba(255,255,255,.92)";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  
  // Reveal (IntersectionObserver) - .reveal 요소는 스크롤 시 등장
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

// AOS (스크롤 애니메이션) - 있으면 자동 적용
  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init({
      once: true,
      duration: 700,
      offset: 80,
      easing: "ease-out"
    });
  }

  // Swiper hero (index에만 있을 수도 있음)
  if (window.Swiper) {
    const el = document.querySelector(".hero-swiper");
    if (el) {
      // eslint-disable-next-line no-new
      new window.Swiper(el, {
        loop: true,
        speed: 900,
        effect: "fade",
        fadeEffect: { crossFade: true },
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true }
      });
    }
  }
})();
