/**
 * NewsViewModel — Logique de présentation actualités
 */
import EventBus from '../services/EventBus.js';

export default class NewsViewModel {
  constructor(api) {
    this.api = api;
    this._articles = [];
  }

  async load() {
    try {
      const raw = await this.api.getAllNews();

      console.log("RAW NEWS:", raw);

      this._articles = raw
        .filter(a => a.title)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      EventBus.emit('news:updated', this._articles);

    } catch (err) {
      console.error("News load error:", err);
      this._articles = [];
      EventBus.emit('news:updated', this._articles);
    }
  }

  get articles() {
    return this._articles;
  }

  get latestArticle() {
    return this._articles[0] ?? null;
  }

  get articlesDisplay() {
    return this._articles.slice(0, 9).map(a => ({
      ...a,
      timeAgo: this._timeAgo(a.date),
      badgeClass: this._badgeClass(a.category)
    }));
  }

  _timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;

    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;

    return `il y a ${Math.floor(diff / 86400)} j`;
  }

  _badgeClass(category) {
    const map = {
      'Monde': 'badge-tech',
      'DW': 'badge-life',
      'Europe': 'badge-security'
    };

    return map[category] ?? 'badge-tech';
  }
}