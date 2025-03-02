const { app, BrowserWindow, ipcMain } = require("electron");
const createMenu = require("./helpers/createMenu");
const path = require("node:path");
const saveFile = require("./helpers/saveFile");
const openFile = require("./helpers/openFile");

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "sticky-note.png",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  createMenu(mainWindow);

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3001');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
};

app.whenReady().then(() => {
  ipcMain.handle("save-file", (event, args) => saveFile(args));
  ipcMain.handle("open-file", openFile);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});