/**
 * NavigationView — Gestion de la navigation entre pages
 * Responsabilités :
 *   - Afficher/masquer les pages selon la navigation
 *   - Gérer l'état actif des boutons de navigation
 */
export default class NavigationView {
  constructor() {
    this.$pages   = document.querySelectorAll('.page');
    this.$navBtns = document.querySelectorAll('.nav-btn');
  }

  init() {
    this.$navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pageName = btn.dataset.page;
        if (pageName) this.showPage(pageName, btn);
      });
    });
  }

  showPage(name, activeBtn) {
    this.$pages.forEach(p => p.classList.remove('active'));
    this.$navBtns.forEach(b => b.classList.remove('active'));

    document.getElementById(`page-${name}`)?.classList.add('active');
    activeBtn?.classList.add('active');
  }
}
