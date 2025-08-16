const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('serialAPI', {
  // Pede ao processo principal para listar as portas
  listPorts: () => ipcRenderer.invoke('serial:listPorts'),
  
  // Pede ao processo principal para conectar a uma porta
  connect: (path) => ipcRenderer.invoke('serial:connect', path),
  
  // Registra uma função (callback) que será chamada quando dados chegarem
  onData: (callback) => {
    ipcRenderer.on('serial:data', (event, data) => {
      callback(data);
    });
  },
});