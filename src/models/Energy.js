/**
 * Energy — Modèle de consommation énergétique
 */
export default class Energy {
  constructor(raw) {
    this.hourlyProfile  = raw.hourlyProfile;
    this.todayData      = raw.todayData;
    this.todayTotal     = raw.todayTotal;
    this.monthTotal     = raw.monthTotal;
    this.estimatedCost  = raw.estimatedCost;
    this.savings        = raw.savings;
  }

  // Pourcentage de chaque barre par rapport au max du profil
  get barsHeightPercent() {
    const max = Math.max(...this.hourlyProfile);
    return this.hourlyProfile.map(v => Math.round((v / max) * 100));
  }

  get todayTotalFormatted()  { return `${this.todayTotal.toFixed(1)} kWh`; }
  get monthTotalFormatted()  { return `${this.monthTotal} kWh`; }
  get estimatedCostFormatted() { return `€ ${this.estimatedCost}`; }
  get savingsFormatted()     { return `↓ ${this.savings}%`; }

  // Différence vs hier (simulée à +12%)
  get diffVsYesterday() {
    const pct = Math.abs(((this.todayTotal - this.todayTotal * 1.12) / (this.todayTotal * 1.12)) * 100);
    return `↓ ${pct.toFixed(1)}% vs hier`;
  }
}
