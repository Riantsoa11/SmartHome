import Device from '../models/Device.js';

export default class DeviceViewModel {
    constructor(api) {
        this.api = api;
        this.devices = [];
        this.weatherData = null;
        this.energyData = null;
        this.climateDevices = [];
    }

    async loadDevices() {
        const data = await this.api.getDevices();
        this.devices = data.map(d => new Device(
            d.id, 
            d.name, 
            d.type, 
            d.status, 
            d.value, 
            d.icon, 
            d.color, 
            d.location
        ));
        return this.devices;
    }

    async loadWeather() {
        this.weatherData = await this.api.getWeather();
        return this.weatherData;
    }

    async loadEnergy() {
        this.energyData = await this.api.getEnergy();
        return this.energyData;
    }

    async loadClimateDevices() {
        const data = await this.api.getClimateDevices();
        this.climateDevices = data;
        return this.climateDevices;
    }

    toggleDevice(id) {
        const device = this.devices.find(d => d.id === id);
        if (device) {
            device.toggle();
            this.api.updateDevice(id, { status: device.status });
            this.api.notify(`${device.name} is now ${device.status ? 'ON' : 'OFF'}`);
        }
        return device;
    }

    updateClimateValue(id, value) {
        const climate = this.climateDevices.find(c => c.id === id);
        if (climate) {
            climate.value = value;
            this.api.updateClimate(id, { value });
        }
        return climate;
    }
}
