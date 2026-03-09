/**
 * CalendarViewModel — Logique de présentation calendrier
 */
import CalendarEvent from '../models/CalendarEvent.js';
import EventBus      from '../services/EventBus.js';

const pad = n => String(n).padStart(2, '0');

export default class CalendarViewModel {
  constructor() {
    const today     = new Date();
    this._year      = today.getFullYear();
    this._month     = today.getMonth();
    this._selectedDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    this._events    = {};
    this._seedSampleEvents();
  }

  // ─── Accesseurs ───────────────────────────────────────────────────────────

  get year()          { return this._year; }
  get month()         { return this._month; }
  get selectedDate()  { return this._selectedDate; }

  eventsForDate(dateKey) {
    return this._events[dateKey] || [];
  }

  get selectedDateEvents() {
    return this.eventsForDate(this._selectedDate);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  navigateMonth(direction) {
    this._month += direction;
    if (this._month < 0)  { this._month = 11; this._year--; }
    if (this._month > 11) { this._month = 0;  this._year++; }
    EventBus.emit('calendar:month-changed', { year: this._year, month: this._month });
  }

  selectDate(dateKey) {
    this._selectedDate = dateKey;
    EventBus.emit('calendar:date-selected', {
      dateKey,
      events: this.selectedDateEvents,
    });
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  addEvent({ name, date, time, colorIndex }) {
    if (!name || !date) return false;
    if (!this._events[date]) this._events[date] = [];

    this._events[date].push(new CalendarEvent({ name, date, time, colorIndex }));
    this._selectedDate = date;

    EventBus.emit('calendar:events-changed', date);
    return true;
  }

  deleteEvent(dateKey, index) {
    if (!this._events[dateKey]) return;
    this._events[dateKey].splice(index, 1);
    if (!this._events[dateKey].length) delete this._events[dateKey];

    EventBus.emit('calendar:events-changed', dateKey);
  }

  // Calcule les cellules du calendrier pour le mois courant
  getCalendarCells() {
    const today    = new Date();
    const firstDay = new Date(this._year, this._month, 1);
    const daysInMonth  = new Date(this._year, this._month + 1, 0).getDate();
    const daysInPrevMonth = new Date(this._year, this._month, 0).getDate();
    const startDow = (firstDay.getDay() + 6) % 7; // Lundi = 0
    const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      let day, month, year, isOtherMonth = false;

      if (i < startDow) {
        day = daysInPrevMonth - startDow + i + 1;
        month = this._month === 0 ? 11 : this._month - 1;
        year  = this._month === 0 ? this._year - 1 : this._year;
        isOtherMonth = true;
      } else if (i >= startDow + daysInMonth) {
        day = i - startDow - daysInMonth + 1;
        month = this._month === 11 ? 0 : this._month + 1;
        year  = this._month === 11 ? this._year + 1 : this._year;
        isOtherMonth = true;
      } else {
        day = i - startDow + 1;
        month = this._month;
        year  = this._year;
      }

      const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;
      return {
        day,
        dateKey,
        isOtherMonth,
        isToday: year === today.getFullYear() && month === today.getMonth() && day === today.getDate(),
        isSelected: dateKey === this._selectedDate,
        events: this.eventsForDate(dateKey),
      };
    });
  }

  // ─── Données d'exemple ────────────────────────────────────────────────────

  _seedSampleEvents() {
    const today = new Date();
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 5);

    this.addEvent({ name: 'Révision chaudière', date: fmt(today),    time: '10:00', colorIndex: 0 });
    this.addEvent({ name: 'Livraison colis',     date: fmt(today),    time: '14:30', colorIndex: 1 });
    this.addEvent({ name: 'Réunion famille',     date: fmt(tomorrow), time: '19:00', colorIndex: 2 });
    this.addEvent({ name: 'Maintenance réseau',  date: fmt(nextWeek), time: '09:00', colorIndex: 3 });
  }
}
