// Ez a JS csak akkor mutatja a footert, ha az oldal aljára görgetsz
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('app-footer .footer') || document.querySelector('app-footer footer');
    if (!footer) return;
    // Először elrejtjük a footert
    footer.style.display = 'none';
    function checkFooterVisibility() {
      // Ellenőrizzük, hogy az oldal alján vagyunk-e
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        footer.style.display = '';
      } else {
        footer.style.display = 'none';
      }
    }
    window.addEventListener('scroll', checkFooterVisibility);
    window.addEventListener('resize', checkFooterVisibility);
    // Első ellenőrzés
    checkFooterVisibility();
  });
})();
