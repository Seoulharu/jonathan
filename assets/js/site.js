function toggleMenu(){
  const nav = document.getElementById('nav-menu');
  if(!nav) return;
  nav.classList.toggle('active');
}
function closeMenu(){
  const nav = document.getElementById('nav-menu');
  if(!nav) return;
  nav.classList.remove('active');
}
document.addEventListener('click', (e)=>{
  const nav = document.getElementById('nav-menu');
  const btn = document.querySelector('.menu-toggle');
  if(!nav || !btn) return;
  if(nav.classList.contains('active')){
    const inside = nav.contains(e.target) || btn.contains(e.target);
    if(!inside) nav.classList.remove('active');
  }
});
