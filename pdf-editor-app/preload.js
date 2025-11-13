const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectPdfFiles: () => ipcRenderer.invoke('select-pdf-files'),
  readPdfFile: (filePath) => ipcRenderer.invoke('read-pdf-file', filePath),
  savePdfFile: (pdfBytes, defaultName) => ipcRenderer.invoke('save-pdf-file', pdfBytes, defaultName),
  showMessage: (options) => ipcRenderer.invoke('show-message', options)
});
