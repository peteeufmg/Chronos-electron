// electron.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { URL } = require('url'); // 1. Adicione a importação do URL
const { SerialPort } = require('serialport');
const startServer = require("./back/src/server");

let port;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  // ... (o seu código ipcMain permanece igual)
  ipcMain.handle('serial:listPorts', async () => {
    return await SerialPort.list();
  });

  ipcMain.handle('serial:connect', async (event, path) => {
    if (port && port.isOpen) {
      port.close();
    }
    try {
      port = new SerialPort({ path, baudRate: 9600 });
      
      port.on('data', (data) => {
        win.webContents.send('serial:data', data.toString());
      });

      return { success: true, path };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });


  const isDev = false;
  const devURL = "http://localhost:5173";

  if (isDev) {
    win.loadURL(devURL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'front/dist/index.html'));
  }
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});