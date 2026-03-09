/**
 * ApiService — Centralise tous les appels réseau et données locales
 *
 * Responsabilités :
 *   - Fetch météo (Open-Meteo)
 *   - Fetch actualités (RSS via allorigins)
 *   - Données simulées (devices, energy, climate)
 *   - Notifications système
 *
 * ❌ Pas de DOM ici
 * ❌ Pas de logique de présentation ici
 */

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=45.7485&longitude=4.8467' +
  '&current=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m' +
  '&hourly=temperature_2m' +
  '&daily=weathercode,temperature_2m_max,temperature_2m_min' +
  '&timezone=Europe%2FParis&forecast_days=5';

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml',        source: 'BBC News',      category: 'Monde'   },
  { url: 'https://rss.dw.com/rdf/rss-en-all',                  source: 'Deutsche Welle', category: 'DW'     },
  { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC Europe',    category: 'Europe'  },
];

export default class ApiService {

  // ─── Météo ────────────────────────────────────────────────────────────────
async getWeather() {
  try {
    const response = await fetch(OPEN_METEO_URL);

    if (!response.ok) {
      throw new Error("Weather API error");
    }

    return await response.json();

  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
}
  


  // ─── Actualités ───────────────────────────────────────────────────────────

 async getNewsFromFeed(feed) {
  try {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("RSS fetch failed:", feed.url);
      return [];
    }

    const json = await response.json();

    if (!json.items) return [];

    return json.items.slice(0, 4).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      source: feed.source,
      category: feed.category
    }));

  } catch (err) {
    console.error("News error:", err);
    return [];
  }
}

  async getAllNews() {

  const results = await Promise.all(
    RSS_FEEDS.map(feed => this.getNewsFromFeed(feed))
  );

  return results.flat();
}

  // ─── Appareils (données simulées) ─────────────────────────────────────────

  async getDevices() {
    return [
      { id: 1, name: 'Salon',       type: 'light', status: true,  value: 75,  icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Salon'       },
      { id: 2, name: 'Chambre',     type: 'light', status: false, value: 0,   icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Chambre'     },
      { id: 3, name: 'Cuisine',     type: 'light', status: true,  value: 100, icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Cuisine'     },
      { id: 4, name: 'Salle de bain', type: 'light', status: false, value: 0, icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Salle de bain' },
      { id: 5, name: 'Bureau',      type: 'light', status: true,  value: 50,  icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Bureau'      },
      { id: 6, name: 'Couloir',     type: 'light', status: false, value: 0,   icon: '💡', color: { start: '#FF9500', end: '#FFD700' }, location: 'Couloir'     },
    ];
  }

  async updateDevice(id, changes) {
    // Ici : appel API réel ou stockage local
    console.log(`[API] Device ${id} updated`, changes);
  }

  // ─── Volets ───────────────────────────────────────────────────────────────

  async getBlinds() {
    return [
      { id: 1, name: 'Salon',   position: 100 },
      { id: 2, name: 'Chambre', position: 50  },
      { id: 3, name: 'Cuisine', position: 0   },
    ];
  }

  async updateBlind(id, changes) {
    console.log(`[API] Blind ${id} updated`, changes);
  }

  // ─── Climatisation ────────────────────────────────────────────────────────

  async getClimateDevices() {
    return [
      { id: 1, name: 'Salon',   icon: '❄️', color: '#00bfff', status: 'AUTO',   value: 22 },
      { id: 2, name: 'Chambre', icon: '🌡️', color: '#4fffb0', status: 'CHALEUR', value: 20 },
    ];
  }

  async updateClimate(id, changes) {
    console.log(`[API] Climate ${id} updated`, changes);
  }

  // ─── Énergie (données simulées) ───────────────────────────────────────────

  async getEnergy() {
    const hourlyProfile = [
      0.5, 0.4, 0.3, 0.3, 0.4, 0.8, 2.1, 3.5,
      4.2, 3.8, 3.5, 3.8, 4.0, 3.6, 3.2, 3.5,
      4.8, 6.2, 7.1, 6.8, 5.5, 4.2, 3.0, 1.8,
    ];
    const currentHour = new Date().getHours();
    const todayData = hourlyProfile.slice(0, currentHour + 1);

    return {
      hourlyProfile,
      todayData,
      todayTotal:  todayData.reduce((s, v) => s + v, 0),
      monthTotal:  187,
      estimatedCost: 42,
      savings:     8,
    };
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────────

  notify(message) {
    console.log(`[Notification] ${message}`);
    // Extensible : toast, push notification, etc.
  }

  getHAConfig(){

return {

url: localStorage.getItem("ha_url"),
token: localStorage.getItem("ha_token")

};

}


async callHAService(domain, service, data){

const config = this.getHAConfig();

return fetch(`${config.url}/api/services/${domain}/${service}`, {

method:"POST",

headers:{
"Authorization":`Bearer ${config.token}`,
"Content-Type":"application/json"
},

body: JSON.stringify(data)

});

}
}
