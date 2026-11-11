const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  newProject: (params) => ipcRenderer.invoke('project:new', params),
  openProject: () => ipcRenderer.invoke('dialog:openProject'),
  printProject: (options) => ipcRenderer.invoke('window:print', options),
  exportPdf: (options) => ipcRenderer.invoke('dialog:exportPdf', options),
  exportData: (options) => ipcRenderer.invoke('dialog:exportData', options),
  onProjectLoaded: (cb) => ipcRenderer.on('project-data', (_e, data) => cb(data))
});
