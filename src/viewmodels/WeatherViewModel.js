/**
 * WeatherViewModel — Logique de présentation météo
 */
import Weather   from '../models/Weather.js';
import EventBus  from '../services/EventBus.js';

const DAYS_SHORT  = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default class WeatherViewModel {
  constructor(api) {
    this.api     = api;
    this._weather = null;
  }

  async load() {
  const raw = await this.api.getWeather();

  console.log("RAW WEATHER:", raw);   // ← AJOUTE ÇA

  this._weather = new Weather(raw);
  EventBus.emit('weather:updated', this._weather);
  console.log("RAW WEATHER:", raw);
  console.log("CURRENT:", raw.current);
}

get hourlyChart() {
  if (!this._weather) return [];
  return this._weather.hourlyTemps.map(h => ({
    hour: h.hour,
    temp: h.temp
  }));
}
  get weather() { return this._weather; }

  // Données prêtes à l'emploi pour la View
  get currentDisplay() {
    if (!this._weather) return null;
    return {
      icon:        this._weather.icon,
      temperature: `${this._weather.temperature}°C`,
      description: this._weather.description,
      humidity:    `${this._weather.humidity}%`,
      windSpeed:   `${this._weather.windSpeed} km/h`,
      feelsLike:   `${this._weather.feelsLike}°C`,
    };
  }

  get forecastDisplay() {
    if (!this._weather) return [];
    return this._weather.forecast.map(day => {
      const date = new Date(day.date + 'T12:00:00');
      return {
        dayLabel: DAYS_SHORT[date.getDay()],
        icon:     Weather.iconFor(day.code),
        label:    Weather.labelFor(day.code),
        tempMax:  `${day.tempMax}°`,
        tempMin:  `${day.tempMin}°`,
      };
    });
  }
}
