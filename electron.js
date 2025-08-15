const { app, BrowserWindow } = require('electron');
const path = require('path');
const startServer = require("./back/src/server");

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Defina a URL de dev manualmente (sem .env)
  const isDev = true; // coloque false quando for build
  const devURL = "http://localhost:5173";

  if (isDev) {
    win.loadURL(devURL);
  } else {
    win.loadFile(path.join(__dirname, 'frontend/build/index.html'));
  }
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});