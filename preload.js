const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getDevices: () => ipcRenderer.invoke('get-devices'),
    notify: (message) => ipcRenderer.send('notify', message)
});
