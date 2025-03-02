const { dialog } = require("electron");
const fs = require("fs");

async function openFile(mainWindow) {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Text Files", extensions: ["txt"] }]
    });
    
    if (!filePaths || filePaths.length === 0) return;
    
    const content = await fs.promises.readFile(filePaths[0], "utf8");
    mainWindow.webContents.send("file-opened", { content, filePath: filePaths[0] });
    return { content, filePath: filePaths[0] };
  } catch (error) {
    console.error('Error opening file:', error);
    return null;
  }
}

module.exports = openFile;
