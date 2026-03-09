/**
 * DeviceViewModel — Logique de présentation des appareils
 */

import Device    from '../models/Device.js';
import EventBus  from '../services/EventBus.js';

export default class DeviceViewModel {

  constructor(api) {

    this.api = api;

    this._devices = [];
    this._blinds  = [];
    this._climateDevices = [];

    this.climateTemp = 22;
    this.climateMode = 'AUTO';

  }

  // ─── Chargement ─────────────────────────────────

  async loadAll() {

    await Promise.all([
      this.loadDevices(),
      this.loadBlinds(),
      this.loadClimateDevices()
    ]);

  }

  async loadDevices() {

    // appareils simulés API
    const apiDevices = await this.api.getDevices();

    // appareils ajoutés par l'utilisateur
    const customDevices = this._loadCustomDevices();

    this._devices = [
      ...apiDevices.map(d => new Device(d)),
      ...customDevices.map(d => new Device(d))
    ];

    EventBus.emit('devices:updated', this.lights);
    EventBus.emit('devices:count-updated', this.activeDevicesCount);

    return this._devices;

  }

  async loadBlinds() {

    this._blinds = await this.api.getBlinds();

    EventBus.emit('blinds:updated', this._blinds);

    return this._blinds;

  }

  async loadClimateDevices() {

    this._climateDevices = await this.api.getClimateDevices();

    EventBus.emit('climate:updated', this._climateDevices);

    return this._climateDevices;

  }

  // ─── Accesseurs ─────────────────────────────────

  get lights() {
    return this._devices.filter(d => d.type === 'light');
  }

  get activeDevicesCount() {
    return this._devices.filter(d => d.status).length;
  }

  get blinds() {
    return this._blinds;
  }

  get climateDevices() {
    return this._climateDevices;
  }

  // ─── Actions utilisateur ────────────────────────

  toggleDevice(id) {

    const device = this._devices.find(d => d.id === id);

    if (!device) return;

    device.toggle();

    this.api.updateDevice(id, { status: device.status });

    this.api.notify(
      `${device.name} : ${device.status ? 'allumé' : 'éteint'}`
    );

    EventBus.emit('devices:updated', this.lights);
    EventBus.emit('devices:count-updated', this.activeDevicesCount);

  }

  adjustBlind(id, direction) {

    const blind = this._blinds.find(b => b.id === id);

    if (!blind) return;

    blind.position =
      Math.min(100, Math.max(0, blind.position + direction * 25));

    this.api.updateBlind(id, { position: blind.position });

    EventBus.emit('blinds:updated', this._blinds);

  }

  setClimateTemp(delta) {

    this.climateTemp =
      Math.min(30, Math.max(15, this.climateTemp + delta));

    EventBus.emit('climate:temp-updated', this.climateTemp);

  }

  setClimateMode(mode) {

    this.climateMode = mode;

    EventBus.emit('climate:mode-updated', mode);

  }

  // ─── Appareils personnalisés ────────────────────

  _loadCustomDevices(){

    const custom =
      JSON.parse(localStorage.getItem("custom_devices") || "[]");

    return custom.map((d,i)=>({

      id: `custom-${i}`,
      name: d.name,
      type: d.type,
      status: false,
      value: 0,
      icon: d.icon ?? "🔧",
      location: d.location ?? "Maison"

    }));

  }

}