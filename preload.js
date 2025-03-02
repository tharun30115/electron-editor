// A preload script contains code that runs before your web page is loaded into the browser window. It has access to both DOM APIs and Node.js environment, and is often used to expose privileged APIs to the renderer via the contextBridge API.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onFileOpen: (callback) => ipcRenderer.on('file-opened', (_, data) => callback(data)),
  onFileSaved: (callback) => ipcRenderer.on('file-saved', (_, data) => callback(data)),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  openFile: () => ipcRenderer.invoke('open-file')
});
