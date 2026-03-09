/**
 * CalendarViewModel — Logique du calendrier
 */

import EventBus from '../services/EventBus.js';

export default class CalendarViewModel {

  constructor() {

    const today = new Date();

    this.month = today.getMonth();
    this.year  = today.getFullYear();

    this.selectedDate = this._formatDate(today);

    // stockage événements
    this._events =
      JSON.parse(localStorage.getItem("calendar_events") || "{}");

  }

  // ─── Navigation ─────────────────────────────────

  navigateMonth(delta){

    this.month += delta;

    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }

    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }

    EventBus.emit("calendar:month-changed");

  }

  selectDate(dateKey){

    this.selectedDate = dateKey;

    EventBus.emit("calendar:date-selected");

  }

  // ─── Ajout événement ────────────────────────────

  addEvent({name,date,time,colorIndex}){

    if (!name || !date) return false;

    if(!this._events[date])
      this._events[date] = [];

    this._events[date].push({
      name,
      time,
      colorIndex
    });

    localStorage.setItem(
      "calendar_events",
      JSON.stringify(this._events)
    );

    EventBus.emit("calendar:events-changed");

    return true;

  }

  deleteEvent(date,index){

    if(!this._events[date]) return;

    this._events[date].splice(index,1);

    if(!this._events[date].length)
      delete this._events[date];

    localStorage.setItem(
      "calendar_events",
      JSON.stringify(this._events)
    );

    EventBus.emit("calendar:events-changed");

  }

  // ─── Getters ────────────────────────────────────

  get selectedDateEvents(){

    const list = this._events[this.selectedDate] ?? [];

    return list.map(ev => ({
      ...ev,
      timeDisplay: ev.time || "--:--"
    }));

  }

  getCalendarCells(){

    const firstDay =
      new Date(this.year,this.month,1);

    const startDay =
      (firstDay.getDay()+6)%7;

    const daysInMonth =
      new Date(this.year,this.month+1,0).getDate();

    const cells=[];

    for(let i=0;i<42;i++){

      const day=i-startDay+1;

      const dateObj =
        new Date(this.year,this.month,day);

      const dateKey =
        this._formatDate(dateObj);

      const events =
        this._events[dateKey] ?? [];

      cells.push({

        day: dateObj.getDate(),
        dateKey,
        events,

        isOtherMonth:
          dateObj.getMonth()!==this.month,

        isToday:
          dateKey===this._formatDate(new Date()),

        isSelected:
          dateKey===this.selectedDate

      });

    }

    return cells;

  }

  // ─── Utils ──────────────────────────────────────

  _formatDate(d){

    return d.toISOString().slice(0,10);

  }

}