const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    // Devices
    getDevices: () => ipcRenderer.invoke('get-devices'),
    updateDevice: (id, data) => ipcRenderer.invoke('update-device', id, data),

    // Weather
    getWeather: () => ipcRenderer.invoke('get-weather'),

    // Energy
    getEnergy: () => ipcRenderer.invoke('get-energy'),

    // Climate Devices
    getClimateDevices: () => ipcRenderer.invoke('get-climate-devices'),
    updateClimate: (id, data) => ipcRenderer.invoke('update-climate', id, data),

    // Lights
    getLights: () => ipcRenderer.invoke('get-lights'),
    updateLight: (id, data) => ipcRenderer.invoke('update-light', id, data),

    // Blinds
    getBlinds: () => ipcRenderer.invoke('get-blinds'),
    updateBlind: (id, data) => ipcRenderer.invoke('update-blind', id, data),

    // Thermostat
    getThermostat: () => ipcRenderer.invoke('get-thermostat'),
    updateThermostat: (data) => ipcRenderer.invoke('update-thermostat', data),

    // News
    getNews: () => ipcRenderer.invoke('get-news'),

    // System Stats
    getSystemStats: () => ipcRenderer.invoke('get-system-stats'),

    // Notifications
    notify: (message) => ipcRenderer.send('notify', message),

    // External links
    openExternal: (url) => ipcRenderer.send('open-external', url),
});
