/**
 * EnergyViewModel — Logique de présentation énergie
 */
import Energy   from '../models/Energy.js';
import EventBus from '../services/EventBus.js';

export default class EnergyViewModel {
  constructor(api) {
    this.api     = api;
    this._energy = null;
  }

  async load() {
    const raw = await this.api.getEnergy();
    this._energy = new Energy(raw);
    EventBus.emit('energy:updated', this._energy);
    return this._energy;
  }

  get energy() { return this._energy; }

  // Données prêtes pour le graphique
  get chartBars() {
    if (!this._energy) return [];
    return this._energy.barsHeightPercent.map((heightPct, i) => ({
      heightPct,
      kwh: this._energy.hourlyProfile[i].toFixed(1),
      hour: `${String(i).padStart(2, '0')}:00`,
    }));
  }

  get summaryDisplay() {
    if (!this._energy) return null;
    return {
      today:         this._energy.todayTotalFormatted,
      month:         this._energy.monthTotalFormatted,
      cost:          this._energy.estimatedCostFormatted,
      savings:       this._energy.savingsFormatted,
      diffVsYesterday: this._energy.diffVsYesterday,
    };
  }
}
