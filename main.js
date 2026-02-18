const { app, BrowserWindow, ipcMain, Notification, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1280,
    minHeight: 800,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: true,
    titleBarStyle: 'default',
  });

  // Charge le fichier HTML vanilla
  mainWindow.loadFile(path.join(__dirname, 'src/views/index.html'));
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ========== IPC HANDLERS ==========

// Devices
ipcMain.handle('get-devices', async () => {
  return [
    {
      id: 1,
      name: 'Light',
      type: 'light',
      status: false,
      value: 0,
      icon: '💡',
      color: { start: '#FF9500', end: '#FFD700' },
      location: 'Liv. Room'
    },
    {
      id: 2,
      name: 'Climate',
      type: 'climate',
      status: true,
      value: 22,
      icon: '🌡️',
      color: { start: '#FF9500', end: '#FFD700' },
      location: 'Liv. Room'
    },
    {
      id: 3,
      name: 'AC',
      type: 'ac',
      status: true,
      value: 20,
      icon: '❄️',
      color: { start: '#00D9FF', end: '#7B2FFF' },
      location: 'Bedroom'
    },
    {
      id: 4,
      name: 'Sound',
      type: 'sound',
      status: false,
      value: 0,
      icon: '🔊',
      color: { start: '#FF006B', end: '#7B2FFF' },
      location: 'Liv. Room'
    }
  ];
});

ipcMain.handle('update-device', async (event, id, data) => {
  console.log(`Device ${id} updated:`, data);
  return { success: true };
});

// Weather
ipcMain.handle('get-weather', async () => {
  return {
    current: {
      temp: 23,
      tempLow: 13,
      condition: 'A sun with a cool',
      icon: '☀️'
    },
    forecast: [
      {
        id: 1,
        time: 'Anytime',
        name: 'Rain',
        type: 'rain',
        temp: 20,
        tempLow: 16
      },
      {
        id: 2,
        time: 'Tomorrow',
        name: 'Storm',
        type: 'storm',
        temp: 16,
        tempLow: 14
      },
      {
        id: 3,
        time: 'Thursday',
        name: 'Rain',
        type: 'rain',
        temp: 17,
        tempLow: 12
      }
    ],
    sunrise: '6:30 PM',
    sunset: '7:21 AM'
  };
});

// Energy
ipcMain.handle('get-energy', async () => {
  return {
    chart: [
      { day: '18', value: 22.5 },
      { day: '19', value: 18.3 },
      { day: '20', value: 28.7 },
      { day: '22', value: 33.7 },
      { day: '23', value: 25.2 }
    ]
  };
});

// Climate Devices
ipcMain.handle('get-climate-devices', async () => {
  return [
    {
      id: 1,
      name: 'Air Conditions',
      status: '(2218)',
      value: 70,
      icon: '❄️',
      color: '#00D9FF'
    },
    {
      id: 2,
      name: 'Air Conditions',
      status: '(3177)',
      value: 68,
      icon: '❄️',
      color: '#FF006B'
    },
    {
      id: 3,
      name: 'Climate',
      status: '(8811)',
      value: 30,
      icon: '🌡️',
      color: '#FF9500'
    },
    {
      id: 4,
      name: 'Light',
      status: '(3177)',
      value: 55,
      icon: '💡',
      color: '#00FF88'
    }
  ];
});

ipcMain.handle('update-climate', async (event, id, data) => {
  console.log(`Climate ${id} updated:`, data);
  return { success: true };
});

// Lights
ipcMain.handle('get-lights', async () => {
  return [
    { id: 1, name: 'Living Room', room: 'Living Room', isOn: true, brightness: 75 },
    { id: 2, name: 'Bedroom', room: 'Bedroom', isOn: false, brightness: 0 },
    { id: 3, name: 'Kitchen', room: 'Kitchen', isOn: true, brightness: 100 },
    { id: 4, name: 'Bathroom', room: 'Bathroom', isOn: false, brightness: 0 },
  ];
});

ipcMain.handle('update-light', async (event, id, data) => {
  console.log(`Light ${id} updated:`, data);
  return { success: true };
});

// Blinds
ipcMain.handle('get-blinds', async () => {
  return [
    { id: 1, name: 'Living Room', room: 'Living Room', position: 100 },
    { id: 2, name: 'Bedroom', room: 'Bedroom', position: 50 },
    { id: 3, name: 'Kitchen', room: 'Kitchen', position: 0 },
  ];
});

ipcMain.handle('update-blind', async (event, id, data) => {
  console.log(`Blind ${id} updated:`, data);
  return { success: true };
});

// Thermostat
ipcMain.handle('get-thermostat', async () => {
  return {
    id: 1,
    name: 'Main Thermostat',
    temperature: 21.5,
    targetTemp: 22,
    mode: 'auto',
  };
});

ipcMain.handle('update-thermostat', async (event, data) => {
  console.log('Thermostat updated:', data);
  return { success: true };
});

// News
ipcMain.handle('get-news', async () => {
  return [
    {
      id: 1,
      title: 'Smart Home Market Expected to Grow 25% This Year',
      source: 'Tech News',
      time: '2 hours ago',
      category: 'Technology',
      url: 'https://example.com/article1',
    },
    {
      id: 2,
      title: 'New Energy Saving Tips: Reduce Bills by 30%',
      source: 'Green Living',
      time: '5 hours ago',
      category: 'Lifestyle',
      url: 'https://example.com/article2',
    },
    {
      id: 3,
      title: 'IoT Security: Best Practices for Smart Homes',
      source: 'Security Today',
      time: '8 hours ago',
      category: 'Security',
      url: 'https://example.com/article3',
    },
  ];
});

// System Stats
ipcMain.handle('get-system-stats', async () => {
  return {
    activeDevices: 24,
    networkStatus: 'Stable',
    alerts: 2,
  };
});

// Notifications
ipcMain.on('notify', (event, message) => {
  new Notification({
    title: 'SmartHome Dashboard',
    body: message,
  }).show();
});

// Open external links
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});