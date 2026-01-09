document.addEventListener("DOMContentLoaded", () => {
  // AOS (있을 때만)
  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init();
  }

  // 헤더 스크롤 시 class 토글 (header.scrolled)
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // (데스크탑) "진료안내" hover 드롭다운 자동 생성
  const nav = document.getElementById("nav-menu");
  if (nav) {
    const treatLink = Array.from(nav.querySelectorAll("a"))
      .find(a => a.textContent.trim() === "진료안내");

    if (treatLink) {
      const li = treatLink.closest("li");
      if (li && !li.querySelector(".submenu")) {
        li.classList.add("has-sub");

        // 현재 페이지 위치에 맞는 base 경로 계산
        // 예: "../treatments/index.html" -> "../"
        // 예: "../../treatments/index.html" -> "../../"
        // 예: "treatments/index.html" -> ""
        const href = treatLink.getAttribute("href") || "";
        let base = "";

        if (href.includes("treatments/index.html")) {
          base = href.split("treatments/index.html")[0];
        } else if (href.includes("treatments/")) {
          base = href.split("treatments/")[0];
        }

        const submenu = document.createElement("ul");
        submenu.className = "submenu";
        submenu.innerHTML = `
          <li><a href="${base}treatments/implants/implant.html">임플란트</a></li>
          <li><a href="${base}treatments/tooth/tooth.html">보존/충치</a></li>
          <li><a href="${base}treatments/beauty/beauty.html">심미/미백</a></li>
        `;

        li.appendChild(submenu);
      }
    }
  }

  // 모바일 메뉴: 바깥 클릭하면 닫기
  document.addEventListener("click", (e) => {
    const navEl = document.getElementById("nav-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (!navEl || !toggle) return;

    const clickedInsideNav = navEl.contains(e.target);
    const clickedToggle = toggle.contains(e.target);

    if (!clickedInsideNav && !clickedToggle) navEl.classList.remove("active");
  });

  // 모바일 메뉴: 메뉴 클릭하면 닫기(선택이지만 편함)
  if (nav) {
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      // 모바일에서만 닫기
      if (window.matchMedia("(max-width: 768px)").matches) {
        nav.classList.remove("active");
      }
    });
  }
});

// HTML에서 onclick="toggleMenu()" 쓰고 있어서 전역으로 유지
function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  if (nav) nav.classList.toggle("active");
}
