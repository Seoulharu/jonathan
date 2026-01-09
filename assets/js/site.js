document.addEventListener("DOMContentLoaded", () => {
  // AOS (있을 때만)
  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init();
  }

  // 헤더 스크롤 시 class 토글
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // (데스크탑) hover 드롭다운 + (모바일) 펼치기/닫기 토글
  const nav = document.getElementById("nav-menu");
  if (nav) {
    const treatLink = Array.from(nav.querySelectorAll("a"))
      .find(a => a.textContent.trim() === "진료안내");

    if (treatLink) {
      const li = treatLink.closest("li");
      if (li && !li.querySelector(".submenu")) {
        li.classList.add("has-sub");

        // ✅ 핵심: "진료안내" 링크가 가리키는 폴더를 기준(treatDir)으로 서브링크 생성
        // 예) index에서: "treatments/index.html" -> treatDir = "treatments/"
        // 예) introduce에서: "../treatments/index.html" -> "../treatments/"
        // 예) treatments/implants에서: "../index.html" -> "../"  (= treatments/)
        const raw = (treatLink.getAttribute("href") || "").split("#")[0].split("?")[0];
        let treatDir = raw;

        if (treatDir.endsWith("index.html")) {
          treatDir = treatDir.slice(0, -("index.html".length));
        }
        if (treatDir !== "" && !treatDir.endsWith("/")) treatDir += "/";

        const submenu = document.createElement("ul");
        submenu.className = "submenu";
        submenu.innerHTML = `
          <li><a href="${treatDir}index.html">진료안내(전체)</a></li>
          <li><a href="${treatDir}implants/implant.html">임플란트</a></li>
          <li><a href="${treatDir}tooth/tooth.html">보존/충치</a></li>
          <li><a href="${treatDir}beauty/beauty.html">심미/미백</a></li>
        `;
        li.appendChild(submenu);

        // ✅ 모바일: 진료안내 누르면 열기/닫기 토글
        treatLink.addEventListener("click", (e) => {
          if (window.matchMedia("(max-width: 768px)").matches) {
            e.preventDefault();

            // 다른 서브메뉴 열려있으면 닫기(원치 않으면 이 줄 제거 가능)
            nav.querySelectorAll("li.has-sub.open").forEach((x) => {
              if (x !== li) x.classList.remove("open");
            });

            li.classList.toggle("open");
          }
        });
      }
    }
  }

  // 모바일 메뉴: 바깥 클릭하면 닫기 (+ 서브메뉴도 접기)
  document.addEventListener("click", (e) => {
    const navEl = document.getElementById("nav-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (!navEl || !toggle) return;

    const clickedInsideNav = navEl.contains(e.target);
    const clickedToggle = toggle.contains(e.target);

    if (!clickedInsideNav && !clickedToggle) {
      navEl.classList.remove("active");
      navEl.querySelectorAll("li.has-sub.open").forEach((x) => x.classList.remove("open"));
    }
  });

  // 모바일 메뉴: 링크 클릭하면 닫기 (단, "진료안내"는 토글이므로 제외)
  if (nav) {
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      if (window.matchMedia("(max-width: 768px)").matches) {
        if (a.textContent.trim() === "진료안내") return;

        nav.classList.remove("active");
        nav.querySelectorAll("li.has-sub.open").forEach((x) => x.classList.remove("open"));
      }
    });
  }
});

// HTML에서 onclick="toggleMenu()" 쓰고 있어서 전역 유지
function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  if (nav) {
    nav.classList.toggle("active");
    if (!nav.classList.contains("active")) {
      nav.querySelectorAll("li.has-sub.open").forEach((x) => x.classList.remove("open"));
    }
  }
}
