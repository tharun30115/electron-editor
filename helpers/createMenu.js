const { app, Menu, dialog } = require("electron");
const openFile = require("./openFile");
const createAboutWindow = require("./createAboutWindow");

function createMenu(mainWindow) {
  const isMac = process.platform === "darwin";

  const menu = Menu.buildFromTemplate([
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        isMac ? { role: "close" } : { role: "quit" },
        {
          label: "Open file",
          accelerator: "CmdOrCtrl+O",
          click: () => openFile(mainWindow),
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => mainWindow.webContents.send('menu-save'),
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => mainWindow.webContents.send('menu-save-as'),
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => createAboutWindow(),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
