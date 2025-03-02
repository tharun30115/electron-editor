const { dialog } = require("electron");
const fs = require("fs");

async function saveFile(data) {
  const { content, filePath, saveAs } = data;
  
  if (!filePath || saveAs) {
    const { filePath: newFilePath } = await dialog.showSaveDialog({
      title: "Save File",
      defaultPath: filePath || "filename.txt",
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    });
    
    if (!newFilePath) return;
    
    await fs.promises.writeFile(newFilePath, content);
    return { filePath: newFilePath };
  }
  
  await fs.promises.writeFile(filePath, content);
  return { filePath }
}

module.exports = saveFile;
