/**
 * CalendarView — Rendu DOM du calendrier
 */
import EventBus from '../../services/EventBus.js';

const MONTHS_SHORT = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR      = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
const MONTHS_FR    = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
const COLOR_HEX    = ['#4fffb0', '#00bfff', '#a78bfa', '#ff6b35'];

export default class CalendarView {
  constructor(viewModel) {
    this.vm = viewModel;
    this._activeColor = 0;
  }

  init() {
    this._syncFormWithSelection();
    this.render();
    this._bindEvents();
    this._subscribeToEventBus();
  }

  render() {
    this._renderMonthLabel();
    this._renderGrid();
    this._renderEventsList();
    this._syncFormWithSelection();
  }

  _renderMonthLabel() {
    const el = document.getElementById('cal-month-lbl');
    if (el) {
      el.textContent = `${MONTHS_SHORT[this.vm.month].toUpperCase()} ${this.vm.year}`;
    }
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
        cell.isToday ? 'today' : '',
        cell.isSelected ? 'selected' : '',
      ].filter(Boolean).join(' ');

      const dots = cell.events.slice(0, 2).map(ev =>
        `<div class="cal-ev-dot ev-c${ev.colorIndex}">${this._escape(ev.name)}</div>`
      ).join('') + (
        cell.events.length > 2
          ? `<div class="cal-ev-dot ev-c${cell.events[2].colorIndex}">+${cell.events.length - 2}</div>`
          : ''
      );

      div.innerHTML = `
        <span class="cal-day-num">${cell.day}</span>
        <div class="cal-day-events">${dots}</div>
      `;

      div.addEventListener('click', () => {
        this.vm.selectDate(cell.dateKey);
        this._syncFormWithSelection();
      });

      container.appendChild(div);
    });
  }

  _renderEventsList() {
    const events = this.vm.selectedDateEvents;
    const dateKey = this.vm.selectedDate;
    const listEl = document.getElementById('cal-ev-list');
    const titleEl = document.getElementById('cal-sel-title');

    if (!dateKey || !listEl) return;

    const dateObj = new Date(`${dateKey}T12:00:00`);

    if (titleEl && !Number.isNaN(dateObj.getTime())) {
      titleEl.textContent = `${DAYS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MONTHS_FR[dateObj.getMonth()]}`;
    }

    if (!events.length) {
      listEl.innerHTML = '<div class="no-events">Aucun événement ce jour</div>';
      return;
    }

    listEl.innerHTML = events.map((ev, i) => `
      <div class="ev-item">
        <div class="ev-bar" style="background:${COLOR_HEX[ev.colorIndex] ?? COLOR_HEX[0]}"></div>
        <div class="ev-info">
          <div class="ev-name">${this._escape(ev.name)}</div>
          <div class="ev-time">${this._escape(ev.timeDisplay)}</div>
        </div>
        <button type="button" class="ev-del" data-date="${dateKey}" data-index="${i}">✕</button>
      </div>
    `).join('');
  }

  _bindEvents() {
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      this.vm.navigateMonth(-1);
    });

    document.getElementById('cal-next')?.addEventListener('click', () => {
      this.vm.navigateMonth(1);
    });

    document.getElementById('color-picker')?.addEventListener('click', e => {
      const cp = e.target.closest('.cp');
      if (!cp) return;

      e.preventDefault();

      document.querySelectorAll('#color-picker .cp').forEach(b => {
        b.classList.remove('sel');
      });

      cp.classList.add('sel');
      this._activeColor = Number(cp.dataset.c) || 0;
    });

    document.getElementById('btn-add-event')?.addEventListener('click', e => {
      e.preventDefault();
      this._addEvent();
    });

    document.getElementById('cal-ev-list')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-date]');
      if (!btn) return;

      this.vm.deleteEvent(btn.dataset.date, Number(btn.dataset.index));
      this.render();
    });
  }

  _addEvent() {
    const nameInput = document.getElementById('ev-name');
    const dateInput = document.getElementById('ev-date');
    const timeInput = document.getElementById('ev-time');

    const name = nameInput?.value.trim() ?? '';
    const date = dateInput?.value || this.vm.selectedDate;
    const time = timeInput?.value ?? '';

    if (!name) {
      alert("Entre un nom d'événement.");
      nameInput?.focus();
      return;
    }

    if (!date) {
      alert("Choisis une date.");
      dateInput?.focus();
      return;
    }

    const ok = this.vm.addEvent({
      name,
      date,
      time,
      colorIndex: this._activeColor ?? 0,
    });

    if (!ok) {
      alert("Impossible d'ajouter l'événement.");
      return;
    }

    if (nameInput) nameInput.value = '';
    if (timeInput) timeInput.value = '';
    if (dateInput) dateInput.value = date;

    this.render();
  }

  _syncFormWithSelection() {
    const dateInput = document.getElementById('ev-date');
    if (dateInput && this.vm.selectedDate && !dateInput.value) {
      dateInput.value = this.vm.selectedDate;
    }

    const selectedColor = document.querySelector('#color-picker .cp.sel');
    this._activeColor = Number(selectedColor?.dataset.c ?? 0);
  }

  _escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[char]));
  }

  _subscribeToEventBus() {
    EventBus.on('calendar:month-changed', () => this.render());
    EventBus.on('calendar:date-selected', () => this.render());
    EventBus.on('calendar:events-changed', () => this.render());
  }
}