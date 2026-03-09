/**
 * EnergyView — Rendu DOM de la consommation énergétique
 * Responsabilités :
 *   - Afficher les données de consommation (totaux, graphiques)
 *   - Mettre à jour l'affichage lors de changements de données
 */
import EventBus from '../../services/EventBus.js';

export default class EnergyView {
  constructor(viewModel) {
    this.vm = viewModel;
  }

  async init() {
    await this.vm.load();
    this._subscribeToEventBus();
  }

  render() {
    const summary = this.vm.summaryDisplay;
    const bars    = this.vm.chartBars;
    if (!summary) return;

    // ── Page énergie ──────────────────────────────────────────────────────
    this._set('es-today', summary.today);
    this._set('es-diff',  summary.diffVsYesterday);

    // ── Dashboard home ────────────────────────────────────────────────────
    this._set('h-e-total', summary.today);
    this._set('h-e-diff',  summary.diffVsYesterday);
    this._set('h-energy',  summary.today);

    // Graphiques
    this._renderBars('energy-bars', bars, 'bar');
    this._renderBars('h-e-bars',    bars, 'dc-bar');
  }

  _renderBars(containerId, bars, cssClass) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = bars.map(bar => `
      <div class="${cssClass}"
           style="height:${bar.heightPct}%"
           title="${bar.kwh} kWh — ${bar.hour}">
      </div>`).join('');
  }

  _set(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _subscribeToEventBus() {
    EventBus.on('energy:updated', () => this.render());
  }
}
