export default class SettingsViewModel {

  saveHAConfig(url, token) {

    localStorage.setItem("ha_url", url);
    localStorage.setItem("ha_token", token);

  }

  addDevice(device) {

    const devices =
      JSON.parse(localStorage.getItem("ha_devices") || "[]");

    devices.push(device);

    localStorage.setItem("ha_devices", JSON.stringify(devices));

  }

  getDevices() {

    return JSON.parse(localStorage.getItem("ha_devices") || "[]");

  }

}