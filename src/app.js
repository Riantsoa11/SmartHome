/**
 * app.js — Point d'entrée de l'application SmartHome
 *
 * Ce fichier :
 *   1. Instancie les services
 *   2. Instancie les ViewModels en leur passant les services
 *   3. Instancie les Views en leur passant les ViewModels
 *   4. Lance l'initialisation
 *
 * ❌ Pas de logique métier ici
 * ❌ Pas de manipulation DOM directe ici
 */

import ApiService        from './services/ApiService.js';

import DeviceViewModel   from './viewmodels/DeviceViewModel.js';
import WeatherViewModel  from './viewmodels/WeatherViewModel.js';
import EnergyViewModel   from './viewmodels/EnergyViewModel.js';
import NewsViewModel     from './viewmodels/NewsViewModel.js';
import CalendarViewModel from './viewmodels/CalendarViewModel.js';

import ClockView         from './views/components/ClockView.js';
import DeviceView        from './views/components/DeviceView.js';
import WeatherView       from './views/components/WeatherView.js';
import EnergyView        from './views/components/EnergyView.js';
import NewsView          from './views/components/NewsView.js';
import CalendarView      from './views/components/CalendarView.js';
import NavigationView    from './views/components/NavigationView.js';
import SettingsViewModel from './viewmodels/SettingsViewModel.js';
import SettingsView from './views/components/SettingsView.js';
// ─── 1. Services ──────────────────────────────────────────────────────────────
const api = new ApiService();

// ─── 2. ViewModels ────────────────────────────────────────────────────────────
const deviceVM   = new DeviceViewModel(api);
const weatherVM  = new WeatherViewModel(api);
const energyVM   = new EnergyViewModel(api);
const newsVM     = new NewsViewModel(api);
const calendarVM = new CalendarViewModel();   // pas d'API externe
const settingsVM = new SettingsViewModel();
const settingsView = new SettingsView(settingsVM);

// ─── 3. Views ─────────────────────────────────────────────────────────────────
const clockView    = new ClockView();
const deviceView   = new DeviceView(deviceVM);
const weatherView  = new WeatherView(weatherVM);
const energyView   = new EnergyView(energyVM);
const newsView     = new NewsView(newsVM);
const calendarView = new CalendarView(calendarVM);
const navView      = new NavigationView();

// ─── 4. Démarrage ─────────────────────────────────────────────────────────────
async function init() {
  // Navigation (synchrone)
  navView.init();

  // Horloge (synchrone, démarre le setInterval)
  clockView.start();

  // Initialisation parallèle des sections asynchrones
  await Promise.allSettled([
    deviceView.init(),
    weatherView.init(),
    energyView.init(),
    newsView.init(),
  ]);

  // Calendrier (synchrone, données locales)
  calendarView.init();

  // Rafraîchissement météo toutes les 10 minutes
  setInterval(() => weatherVM.load(), 10 * 60 * 1000);
}

init();
settingsView.init();