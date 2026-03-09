/**
 * CalendarEvent — Modèle d'événement calendrier
 */
export default class CalendarEvent {
  constructor({ name, date, time = '', colorIndex = 0 }) {
    this.name       = name;
    this.date       = date;       // format: 'YYYY-MM-DD'
    this.time       = time;       // format: 'HH:MM' ou ''
    this.colorIndex = colorIndex; // 0=vert, 1=bleu, 2=violet, 3=orange
  }

  get timeDisplay() {
    return this.time || 'Toute la journée';
  }

  static colorClass(index) {
    return `ev-c${index}`;
  }
}
