export default class DeviceViewModel {

    constructor(api) {
        this.api = api;
        this.devices = [];
    }

    async loadDevices() {
        this.devices = await this.api.getDevices();
        return this.devices;
    }

    toggleDevice(id) {
        const device = this.devices.find(d => d.id === id);
        device.status = !device.status;
    }
}
