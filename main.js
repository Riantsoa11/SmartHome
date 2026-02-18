const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Notification } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('src/views/index.html');
}

app.whenReady().then(createWindow);

// Simulation appareils connectés
ipcMain.handle("get-devices", async () => {
  return [
    { id: 1, name: "Lampe Salon", type: "light", status: true },
    { id: 2, name: "Thermostat", type: "temperature", status: false },
    { id: 3, name: "Caméra Entrée", type: "camera", status: true }
  ];
});

ipcMain.on('notify', (event, message) => {
  new Notification({
    title: 'SMARTHOME',
    body: message
  }).show();
});
