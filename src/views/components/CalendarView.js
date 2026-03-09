/**
 * CalendarView — Rendu DOM du calendrier
 * 
 */
import EventBus from '../../services/EventBus.js';

const MONTHS_SHORT = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR      = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
const MONTHS_FR    = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
const COLOR_HEX    = ['#4fffb0', '#00bfff', '#a78bfa', '#ff6b35'];

export default class CalendarView {
  constructor(viewModel) {
    this.vm = viewModel;
  }

  init() {
    this.render();
    this._bindEvents();
    this._subscribeToEventBus();
  }

  render() {
    this._renderMonthLabel();
    this._renderGrid();
    this._renderEventsList();
  }

  // ─── Rendu partiel ────────────────────────────────────────────────────────

  _renderMonthLabel() {
    const el = document.getElementById('cal-month-lbl');
    if (el) el.textContent = `${MONTHS_SHORT[this.vm.month].toUpperCase()} ${this.vm.year}`;
  }

  _renderGrid() {
    const container = document.getElementById('cal-days');
    if (!container) return;

    container.innerHTML = '';
    this.vm.getCalendarCells().forEach(cell => {
      const div = document.createElement('div');
      div.className = [
        'cal-day',
        cell.isOtherMonth ? 'other-month' : '',
        cell.isToday      ? 'today'       : '',
        cell.isSelected   ? 'selected'    : '',
      ].filter(Boolean).join(' ');

      const dots = cell.events.slice(0, 2).map(ev =>
        `<div class="cal-ev-dot ev-c${ev.colorIndex}">${ev.name}</div>`
      ).join('') + (cell.events.length > 2
        ? `<div class="cal-ev-dot ev-c${cell.events[2].colorIndex}">+${cell.events.length - 2}</div>`
        : '');

      div.innerHTML = `
        <span class="cal-day-num">${cell.day}</span>
        <div class="cal-day-events">${dots}</div>`;

      div.addEventListener('click', () => {
        this.vm.selectDate(cell.dateKey);
        document.getElementById('ev-date').value = cell.dateKey;
      });

      container.appendChild(div);
    });
  }

  _renderEventsList() {
    const events    = this.vm.selectedDateEvents;
    const dateKey   = this.vm.selectedDate;
    const dateObj   = new Date(dateKey + 'T12:00:00');
    const titleEl   = document.getElementById('cal-sel-title');
    const listEl    = document.getElementById('cal-ev-list');

    if (titleEl) titleEl.textContent =
      `${DAYS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MONTHS_FR[dateObj.getMonth()]}`;

    if (!listEl) return;

    if (!events.length) {
      listEl.innerHTML = '<div class="no-events">Aucun événement ce jour</div>';
      return;
    }

    listEl.innerHTML = events.map((ev, i) => `
      <div class="ev-item">
        <div class="ev-bar" style="background:${COLOR_HEX[ev.colorIndex]}"></div>
        <div class="ev-info">
          <div class="ev-name">${ev.name}</div>
          <div class="ev-time">${ev.timeDisplay}</div>
        </div>
        <button class="ev-del" data-date="${dateKey}" data-index="${i}">✕</button>
      </div>`).join('');
  }

  // ─── Liaison des événements DOM ───────────────────────────────────────────

  _bindEvents() {
    // Navigation mois
    document.getElementById('cal-prev')?.addEventListener('click', () => this.vm.navigateMonth(-1));
    document.getElementById('cal-next')?.addEventListener('click', () => this.vm.navigateMonth(1));

    // Sélection couleur
    document.getElementById('color-picker')?.addEventListener('click', e => {
      const cp = e.target.closest('.cp');
      if (!cp) return;
      document.querySelectorAll('.cp').forEach(b => b.classList.remove('sel'));
      cp.classList.add('sel');
      this._activeColor = parseInt(cp.dataset.c);
    });

    // Ajout événement
    document.getElementById('btn-add-event')?.addEventListener('click', () => this._addEvent());

    // Suppression (délégation)
    document.getElementById('cal-ev-list')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-date]');
      if (!btn) return;
      this.vm.deleteEvent(btn.dataset.date, parseInt(btn.dataset.index));
    });
  }

  _addEvent() {
    const name  = document.getElementById('ev-name')?.value.trim();
    const date  = document.getElementById('ev-date')?.value;
    const time  = document.getElementById('ev-time')?.value;

    if (this.vm.addEvent({ name, date, time, colorIndex: this._activeColor ?? 0 })) {
      if (document.getElementById('ev-name'))  document.getElementById('ev-name').value  = '';
      if (document.getElementById('ev-time'))  document.getElementById('ev-time').value  = '';
    }
  }

  // ─── Réactivité ───────────────────────────────────────────────────────────

  _subscribeToEventBus() {
    EventBus.on('calendar:month-changed',   () => this.render());
    EventBus.on('calendar:date-selected',   () => this.render());
    EventBus.on('calendar:events-changed',  () => this.render());
  }
}
