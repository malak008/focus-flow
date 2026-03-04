const { app, BrowserWindow } = require('electron');
const { ipcMain } = require("electron");

const url = require('url');
const path = require('path');
    ipcMain.on('close-app', () => {
        app.quit();
    })
function createMainWindow() {
    
    const mainWindow = new BrowserWindow({
        title: 'Focus-Flow',
        width: 400,
        height: 460,
        // frame: false,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true, 
            nodeIntegration: false,  
        }
    });


    const isDev = !app.isPackaged;

const startUrl = isDev
    ? 'http://localhost:3000'                         
    : url.format({
        pathname: path.join(__dirname, '../build/index.html'), 
        protocol: 'file:',
        slashes: true,
    });

    mainWindow.loadURL(startUrl);

    mainWindow.setWindowButtonVisibility(false);

    mainWindow.setMenuBarVisibility(false);


    mainWindow.webContents.openDevTools();



}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});