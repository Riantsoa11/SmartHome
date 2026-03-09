/**
 * Weather — Modèle météo
 * Transforme la réponse brute Open-Meteo en objet propre
 */

const WMO_CODES = {
  0:  { label: 'Ciel dégagé',       icon: '☀️'  },
  1:  { label: 'Principalement dégagé', icon: '🌤️' },
  2:  { label: 'Partiellement nuageux', icon: '⛅'  },
  3:  { label: 'Nuageux',            icon: '☁️'  },
  45: { label: 'Brouillard',         icon: '🌫️'  },
  48: { label: 'Brouillard givrant', icon: '🌫️'  },
  51: { label: 'Bruine légère',      icon: '🌦️'  },
  61: { label: 'Pluie légère',       icon: '🌧️'  },
  63: { label: 'Pluie',              icon: '🌧️'  },
  65: { label: 'Pluie forte',        icon: '🌧️'  },
  71: { label: 'Neige légère',       icon: '🌨️'  },
  80: { label: 'Averses',            icon: '🌦️'  },
  95: { label: 'Orage',              icon: '⛈️'  },
  99: { label: 'Orage fort',         icon: '⛈️'  },
};

export default class Weather {

  constructor(raw = {}) {

    const c = raw.current ?? {};
    const daily = raw.daily ?? {};

    // Données actuelles
    this.temperature = Math.round(c.temperature_2m ?? 0);
    this.feelsLike   = Math.round(c.apparent_temperature ?? 0);
    this.humidity    = c.relativehumidity_2m ?? 0;

    this.hourlyTemps = raw.hourly.time
  .map((time, i) => ({
    time: time,                          // "2026-03-09T14:00"
    hour: time.slice(11, 16),            // "14:00"
    temp: Math.round(raw.hourly.temperature_2m[i])
  }))
  .filter(h => h.time.startsWith(
    new Date().toISOString().slice(0, 10) // "2026-03-09"
  ));

    // Compatibilité API Open-Meteo (ancienne / nouvelle)
    this.windSpeed   = Math.round(
      c.wind_speed_10m ??
      c.windspeed_10m ??
      0
    );

    this.weatherCode =
      c.weather_code ??
      c.weathercode ??
      0;

    // Prévisions
    const times = daily.time ?? [];

    this.forecast = times.map((date, i) => ({
      date: date,
      code:
        daily.weather_code?.[i] ??
        daily.weathercode?.[i] ??
        0,
      tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
    }));
  }

  get icon() {
    return (WMO_CODES[this.weatherCode] ?? { icon: '❓' }).icon;
  }

  get description() {
    return (WMO_CODES[this.weatherCode] ?? { label: 'Inconnu' }).label;
  }

  // Icône pour les prévisions
  static iconFor(code) {
    return (WMO_CODES[code] ?? { icon: '❓' }).icon;
  }

  static labelFor(code) {
    return (WMO_CODES[code] ?? { label: 'Inconnu' }).label;
  }
}