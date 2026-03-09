/**
 * WeatherView — Rendu DOM de la météo
 * Responsabilités :
 *   - Afficher les données météo formatées
 *   - Générer les prévisions
 *   - Générer le graphique température de la journée
 */

import EventBus from '../../services/EventBus.js';

export default class WeatherView {

  constructor(viewModel) {
    this.vm = viewModel;
  }

  async init() {

    try {
      await this.vm.load();
      this.render();
    } catch {
      this._renderError();
    }

    this._subscribeToEventBus();
  }


  render() {

    const current  = this.vm.currentDisplay;
    const forecast = this.vm.forecastDisplay;

    if (!current) return;

    // ───────── Page météo ─────────

    this._set('w-icon',  current.icon);
    this._set('w-temp',  current.temperature);
    this._set('w-desc',  current.description);
    this._set('w-hum',   current.humidity);
    this._set('w-wind',  current.windSpeed);
    this._set('w-feels', current.feelsLike);

    this._renderChart();

    const forecastList = document.getElementById('forecast-list');

    if (forecastList) {

      forecastList.replaceChildren(
        ...forecast.map(day => {

          const el = document.createElement('div');
          el.className = 'fc-row';

          el.innerHTML = `
            <div class="fc-day">${day.dayLabel}</div>
            <div class="fc-icon">${day.icon}</div>
            <div class="fc-desc">${day.label}</div>
            <div class="fc-temps">
              <span class="fc-max">${day.tempMax}</span>
              <span class="fc-min"> / ${day.tempMin}</span>
            </div>
          `;

          return el;

        })
      );
    }


    // ───────── Dashboard home ─────────

    this._set('h-w-icon',  current.icon);
    this._set('h-w-temp',  current.temperature);
    this._set('h-w-desc',  current.description);
    this._set('h-w-hum',   current.humidity);
    this._set('h-w-wind',  current.windSpeed);
    this._set('h-w-feels', current.feelsLike);
    this._set('h-temp',    current.temperature);

    const hfc = document.getElementById('h-forecast');

    if (hfc) {

      hfc.innerHTML = forecast
        .slice(0, 5)
        .map(day => `
          <div class="dc-fc">
            <div class="dc-fc-day">${day.dayLabel}</div>
            <div class="dc-fc-ico">${day.icon}</div>
            <div class="dc-fc-tmp">${day.tempMax}</div>
          </div>
        `)
        .join('');
    }
  }


  // ───────── Graphique météo ─────────

  _renderChart() {
  const data  = this.vm.hourlyChart;
  const chart = document.getElementById("weather-chart");
  if (!chart || !data?.length) return;

  const Y_MIN = 10, Y_MAX = 30;
  const W = 1000, H = 100;
  const PAD_TOP = 24;    // espace pour les labels de temp au-dessus
  const PAD_BOT = 18;    // espace pour les heures en dessous
  const TOTAL_H = H + PAD_TOP + PAD_BOT;

  const toY = temp =>
    PAD_TOP + (H - ((temp - Y_MIN) / (Y_MAX - Y_MIN)) * H);

  const toX = i => (i / (data.length - 1)) * W;

  const points = data.map((d, i) => `${toX(i)},${toY(d.temp)}`).join(' ');

  const areaPoints =
    `0,${PAD_TOP + H} ` +
    data.map((d, i) => `${toX(i)},${toY(d.temp)}`).join(' ') +
    ` ${W},${PAD_TOP + H}`;

  // Grille horizontale alignée sur les vraies valeurs Y
  const gridLines = [10, 15, 20, 25, 30].map(temp => {
    const y = toY(temp);
    return `<line x1="0" y1="${y}" x2="${W}" y2="${y}"
              stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  }).join('');

  // Labels : on affiche 1 point sur 2, et on décale en haut/bas
  // en alternance pour éviter les chevauchements
  const dotLabels = data.map((d, i) => {
    const x = toX(i);
    const y = toY(d.temp);
    const showLabel = i % 2 === 0;

    const dot = `<circle cx="${x}" cy="${y}" r="2.5"
                   fill="var(--accent,#7eb8f7)" opacity="0.9"/>`;

    if (!showLabel) return `<g>${dot}</g>`;

    // Temp au-dessus, heure en dessous
    const tempY  = y - 7;
    const hourY  = PAD_TOP + H + 14;

    return `
      <g>
        ${dot}
        <text x="${x}" y="${tempY}" text-anchor="middle"
              font-size="9" fill="var(--accent,#7eb8f7)">${d.temp}°</text>
        <text x="${x}" y="${hourY}" text-anchor="middle"
              font-size="8" fill="var(--muted,#666)">${d.hour}</text>
      </g>
    `;
  }).join('');

  chart.innerHTML = `
    <svg viewBox="0 0 ${W} ${TOTAL_H}"
         preserveAspectRatio="none"
         style="width:100%;height:100%;display:block;"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="var(--accent,#7eb8f7)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--accent,#7eb8f7)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>

      ${gridLines}

      <polygon points="${areaPoints}" fill="url(#tempGrad)"/>

      <polyline
        points="${points}"
        fill="none"
        stroke="var(--accent,#7eb8f7)"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Textes dans un SVG séparé avec preserveAspectRatio="xMidYMid meet"
           pour éviter la distorsion du texte -->
      <svg x="0" y="0" width="${W}" height="${TOTAL_H}"
           viewBox="0 0 ${W} ${TOTAL_H}"
           preserveAspectRatio="xMidYMid meet">
        ${dotLabels}
      </svg>
    </svg>
  `;
}


  _renderError() {

    this._set('w-icon',   '⚠️');
    this._set('h-w-icon', '⚠️');

    this._set('w-desc',   'Données indisponibles');
    this._set('h-w-desc', 'Données indisponibles');
  }


  _set(id, text) {

    const el = document.getElementById(id);

    if (el) el.textContent = text;
  }


  _subscribeToEventBus() {

    EventBus.on('weather:updated', () => this.render());
  }

}