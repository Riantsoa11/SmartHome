/**
 * app.js — Point d'entrée de l'application SmartHome
 */

import ApiService        from './services/ApiService.js';

import DeviceViewModel   from './viewmodels/DeviceViewModel.js';
import WeatherViewModel  from './viewmodels/WeatherViewModel.js';
import EnergyViewModel   from './viewmodels/EnergyViewModel.js';
import NewsViewModel     from './viewmodels/NewsViewModel.js';
import CalendarViewModel from './viewmodels/CalendarViewModel.js';
import SettingsViewModel from './viewmodels/SettingsViewModel.js';

import ClockView         from './views/components/ClockView.js';
import DeviceView        from './views/components/DeviceView.js';
import WeatherView       from './views/components/WeatherView.js';
import EnergyView        from './views/components/EnergyView.js';
import NewsView          from './views/components/NewsView.js';
import CalendarView      from './views/components/CalendarView.js';
import NavigationView    from './views/components/NavigationView.js';
import SettingsView      from './views/components/SettingsView.js';


// ─── 1. Services ─────────────────────────────────────
const api = new ApiService();


// ─── 2. ViewModels ───────────────────────────────────
const deviceVM   = new DeviceViewModel(api);
const weatherVM  = new WeatherViewModel(api);
const energyVM   = new EnergyViewModel(api);
const newsVM     = new NewsViewModel(api);
const calendarVM = new CalendarViewModel();
const settingsVM = new SettingsViewModel();


// ─── 3. Views ────────────────────────────────────────
const clockView    = new ClockView();
const deviceView   = new DeviceView(deviceVM);
const weatherView  = new WeatherView(weatherVM);
const energyView   = new EnergyView(energyVM);
const newsView     = new NewsView(newsVM);
const calendarView = new CalendarView(calendarVM);
const navView      = new NavigationView();
const settingsView = new SettingsView(settingsVM);


// ─── 4. Initialisation ───────────────────────────────
async function init() {

  // navigation
  navView.init();

  // horloge
  clockView.start();

  // settings
  settingsView.init();

  // chargement async
  await Promise.allSettled([
    deviceView.init(),
    weatherView.init(),
    energyView.init(),
    newsView.init(),
  ]);

  // calendrier
  calendarView.init();

  // refresh météo
  setInterval(() => {
    weatherVM.load();
  }, 10 * 60 * 1000);

}

init();