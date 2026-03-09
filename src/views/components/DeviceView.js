/**
 * DeviceView — Rendu DOM des appareils (lumières, volets, climatisation)
 *
 * Responsabilités :
 *   - Construire le HTML à partir des données du ViewModel
 *   - Écouter les événements utilisateur (clics)
 *   - Déléguer les actions au ViewModel
 *
 */
import EventBus from '../../services/EventBus.js';

export default class DeviceView {
  constructor(viewModel) {
    this.vm = viewModel;

    // Éléments DOM — chaque $ signifie "référence DOM"
    this.$lightsGrid      = document.getElementById('lights-grid');
    this.$lightsGridHome  = document.getElementById('h-lights');
    this.$blindsList      = document.getElementById('blinds-list');
    this.$blindsHome      = document.getElementById('h-blinds');
    this.$deviceCount     = document.getElementById('h-devices');

    // Climatisation
    this.$climTempPage    = document.getElementById('clim-temp');
    this.$climTempHome    = document.getElementById('h-clim');
  }

  // ─── Initialisation ───────────────────────────────────────────────────────

  async init() {
    await this.vm.loadAll();
    this.render();
    this._bindEvents();
    this._subscribeToEventBus();
  }

  // ─── Rendu complet ────────────────────────────────────────────────────────

  render() {
    this._renderLights();
    this._renderBlinds();
    this._renderDeviceCount();
    this._renderClimate();
  }

  // ─── Rendu partiel ────────────────────────────────────────────────────────

  _renderLights() {
    const html = this.vm.lights.map(l => this._lightCardHtml(l)).join('');

    if (this.$lightsGrid)     this.$lightsGrid.innerHTML     = html;
    if (this.$lightsGridHome) this.$lightsGridHome.innerHTML =
      this.vm.lights.map(l => this._lightCardHomeHtml(l)).join('');
  }

  _renderBlinds() {
    const html = this.vm.blinds.map(b => this._blindItemHtml(b)).join('');
    if (this.$blindsList) this.$blindsList.innerHTML = html;

    if (this.$blindsHome) this.$blindsHome.innerHTML =
      this.vm.blinds.map(b => this._blindMiniHtml(b)).join('');
  }

  _renderDeviceCount() {
    if (this.$deviceCount) this.$deviceCount.textContent = this.vm.activeDevicesCount;
  }

  _renderClimate() {
    const temp = `${this.vm.climateTemp}°`;
    if (this.$climTempPage) this.$climTempPage.textContent = temp;
    if (this.$climTempHome) this.$climTempHome.textContent = temp;
  }

  // ─── Templates HTML ───────────────────────────────────────────────────────

  _lightCardHtml(light) {
    return `
      <div class="big-device-card ${light.status ? 'on' : ''}" data-id="${light.id}">
        <div class="bd-top">
          <div class="bd-icon">💡</div>
          <button class="bd-toggle"></button>
        </div>
        <div class="bd-name">${light.name}</div>
        <div class="bd-val">${light.displayValue}</div>
      </div>`;
  }

  _lightCardHomeHtml(light) {
    return `
      <div class="dc-light ${light.status ? 'on' : ''}" data-id="${light.id}">
        <div class="dc-light-ico">${light.status ? '💡' : '🔦'}</div>
        <div class="dc-light-name">${light.name}</div>
        <div class="${light.status ? 'dc-light-val' : 'dc-light-off'}">${light.displayValue}</div>
      </div>`;
  }

  _blindItemHtml(blind) {
    return `
      <div class="blind-item">
        <div class="blind-lbl">
          <span>${blind.name}</span>
          <span class="blind-pct">${blind.position}%</span>
        </div>
        <div class="prog-bar">
          <div class="prog-fill" style="width:${blind.position}%"></div>
        </div>
        <div class="blind-btns">
          <button class="blind-btn" data-blind-id="${blind.id}" data-dir="1">⬆ Ouvrir</button>
          <button class="blind-btn" data-blind-id="${blind.id}" data-dir="-1">⬇ Fermer</button>
        </div>
      </div>`;
  }

  _blindMiniHtml(blind) {
    return `
      <div class="dc-blind-mini">
        <span class="dc-blind-name">${blind.name}</span>
        <div class="dc-blind-bar">
          <div class="dc-blind-fill" style="width:${blind.position}%"></div>
        </div>
        <span class="dc-blind-pct">${blind.position}%</span>
      </div>`;
  }

  // ─── Liaison des événements DOM ───────────────────────────────────────────

  _bindEvents() {
    // Délégation sur la grille des lumières (page devices)
    this.$lightsGrid?.addEventListener('click', e => {
      const card = e.target.closest('[data-id]');
      if (card) this.vm.toggleDevice(parseInt(card.dataset.id));
    });

    // Délégation sur la grille des lumières (dashboard home)
    this.$lightsGridHome?.addEventListener('click', e => {
      const card = e.target.closest('[data-id]');
      if (card) this.vm.toggleDevice(parseInt(card.dataset.id));
    });

    // Boutons volets (délégation)
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-blind-id]');
      if (!btn) return;
      this.vm.adjustBlind(parseInt(btn.dataset.blindId), parseInt(btn.dataset.dir));
    });

    // Boutons température
    document.querySelectorAll('[data-temp-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.vm.setClimateTemp(parseInt(btn.dataset.tempDelta));
      });
    });

    // Boutons mode climatisation
    document.querySelectorAll('[data-clim-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-clim-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.vm.setClimateMode(btn.dataset.climMode);
      });
    });
  }

  // ─── Réactivité via EventBus ──────────────────────────────────────────────

  _subscribeToEventBus() {
    EventBus.on('devices:updated',      () => this._renderLights());
    EventBus.on('blinds:updated',       () => this._renderBlinds());
    EventBus.on('devices:count-updated', () => this._renderDeviceCount());
    EventBus.on('climate:temp-updated', () => this._renderClimate());
  }
}
