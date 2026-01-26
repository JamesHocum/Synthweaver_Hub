const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  getTheme: () => ipcRenderer.invoke('get-theme'),
  
  // App controls
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
  
  // Events
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  
  // Check if running in Electron
  isElectron: true,
});

// Indicate that we're in Electron environment
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('electron-app');
});
