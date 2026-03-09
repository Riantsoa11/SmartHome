/**
 * NewsView — Rendu DOM des actualités
 */
import EventBus from '../../services/EventBus.js';

export default class NewsView {
  constructor(viewModel) {
    this.vm = viewModel;
  }

  async init() {
    this._subscribeToEventBus();   // ← s'abonner AVANT le load
    this._showLoading();

    try {
      await this.vm.load();
      this.render();               // ← rendu initial garanti
    } catch (err) {
      console.error("NewsView init error:", err);
      this._showError();
    }
  }

  render() {
    const articles = this.vm.articlesDisplay;
    const grid = document.getElementById('news-grid');

    if (!grid) return;

    if (!articles.length) {
      this._showError();
      return;
    }

    grid.innerHTML = articles.map(a => `
      <a class="news-card"
         href="${a.link}"
         target="_blank"
         rel="noopener"
         style="text-decoration:none;color:inherit;display:block">

        <span class="news-badge ${a.badgeClass}">${a.category}</span>

        <div class="news-title">${a.title}</div>

        <div class="news-meta">
          ${a.source} · ${a.timeAgo}
        </div>

      </a>
    `).join('');

    // ─── Dashboard (dernière actu) ─────────────────────
    const latest = this.vm.latestArticle;
    const homeNews = document.getElementById('h-news-latest');

    if (homeNews && latest) {
      homeNews.innerHTML = `
        <div class="dc-news-tag">${latest.category}</div>

        <a href="${latest.link}"
           target="_blank"
           rel="noopener"
           style="text-decoration:none">

          <div class="dc-news-title">${latest.title}</div>

        </a>

        <div class="dc-news-src">
          ${latest.source} · ${this.vm._timeAgo(latest.date)}
        </div>
      `;
    }
  }

  _showLoading() {
    const grid = document.getElementById('news-grid');

    if (grid) {
      grid.innerHTML = `
        <div style="
          color:var(--muted);
          font-family:'Space Mono',monospace;
          font-size:11px;
          grid-column:1/-1;
          padding:20px 0">

          Chargement des actualités...

        </div>
      `;
    }
  }

  _showError() {
    const grid = document.getElementById('news-grid');

    if (grid) {
      grid.innerHTML = `
        <div style="
          color:var(--warn);
          font-family:'Space Mono',monospace;
          font-size:11px;
          grid-column:1/-1">

          Impossible de charger les actualités.

        </div>
      `;
    }
  }

  _subscribeToEventBus() {
    EventBus.on('news:updated', () => this.render());
  }
}