// Bottone scroll to top dinamico
// Mostra il bottone solo dopo aver superato la hero section
document.addEventListener('DOMContentLoaded', function() {
  const scrollBtn = document.querySelector('#scrollToTop');
  const hero = document.getElementById('hero');

  function toggleScrollBtn() {
    if (!hero || !scrollBtn) return;
    const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
    if (window.scrollY > heroBottom) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleScrollBtn);
  toggleScrollBtn();
});
