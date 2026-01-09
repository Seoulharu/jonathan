document.addEventListener("DOMContentLoaded", () => {
  // AOS
  if (window.AOS) AOS.init();

  // header scroll
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // close mobile nav when clicking outside
  document.addEventListener("click", (e) => {
    const nav = document.getElementById("nav-menu");
    const toggle = document.querySelector(".menu-toggle");
    if (!nav || !toggle) return;

    const clickedInsideNav = nav.contains(e.target);
    const clickedToggle = toggle.contains(e.target);

    if (!clickedInsideNav && !clickedToggle) nav.classList.remove("active");
  });
});

function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  if (nav) nav.classList.toggle("active");
}
