const { contextBridge, ipcRenderer } = require("electron");
console.log("preload loaded!");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("close-app")
});

