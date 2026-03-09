/**
 * ClockView — Affichage et mise à jour de l'horloge
 * Responsabilités :
 *   - Afficher l'heure et la date dans différents formats
 *   - Mettre à jour l'affichage chaque minute/seconde
 */

const DAYS_FR   = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
const MONTHS_FR = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
const pad = n => String(n).padStart(2, '0');

export default class ClockView {
  constructor() {
    // Éléments topbar
    this.$topbarClock = document.getElementById('topbar-clock');

    // Éléments horloge dashboard
    this.$hours   = document.getElementById('h-hours');
    this.$minutes = document.getElementById('h-minutes');
    this.$date    = document.getElementById('h-date');
    this.$greeting     = document.getElementById('dash-ampm-greet');
    this.$greetingFull = document.getElementById('dash-greeting');

    // Éléments horloge flip (renderer.js style)
    this.$flipHours   = document.getElementById('hours');
    this.$flipMinutes = document.getElementById('minutes');
    this.$flipAmpm    = document.getElementById('ampm');
    this.$flipDate    = document.getElementById('clock-date');
  }

  start() {
    this._update();
    setInterval(() => this._update(), 1000);
  }

  _update() {
    const now  = new Date();
    const h24  = now.getHours();
    const m    = now.getMinutes();
    const h12  = h24 % 12 || 12;
    const ampm = h24 >= 12 ? 'PM' : 'AM';

    const dateStr = `${DAYS_FR[now.getDay()]} ${now.getDate()} ${MONTHS_FR[now.getMonth()]} ${now.getFullYear()}`;

    // Topbar
    if (this.$topbarClock) this.$topbarClock.textContent = `${pad(h24)}:${pad(m)}`;

    // Dashboard simple
    if (this.$hours)   this.$hours.textContent   = pad(h24);
    if (this.$minutes) this.$minutes.textContent = pad(m);
    if (this.$date)    this.$date.textContent    = dateStr;

    // Greeting
    const greetWord  = h24 < 12 ? 'BONJOUR' : h24 < 18 ? 'BON APRÈS-MIDI' : 'BONSOIR';
    const greetEmoji = h24 < 12 ? '☀️' : h24 < 18 ? '🌤' : '🌙';
    if (this.$greeting)     this.$greeting.textContent     = greetWord;
    if (this.$greetingFull) this.$greetingFull.innerHTML   =
      `${greetWord.charAt(0) + greetWord.slice(1).toLowerCase()}, <span>Smart Home</span> ${greetEmoji}`;

    // Flip clock (renderer.js)
    if (this.$flipHours)   this.$flipHours.innerHTML   = `<span class="d1">${pad(h12)[0]}</span><span class="d2">${pad(h12)[1]}</span>`;
    if (this.$flipMinutes) this.$flipMinutes.innerHTML = `<span class="d1">${pad(m)[0]}</span><span class="d2">${pad(m)[1]}</span>`;
    if (this.$flipAmpm)    this.$flipAmpm.textContent  = ampm;
    if (this.$flipDate)    this.$flipDate.textContent  = dateStr;
  }
}
