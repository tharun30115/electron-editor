const { dialog } = require("electron");
const fs = require("fs");

<<<<<<< HEAD
async function saveFile(event, data) {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save File",
    defaultPath: "filename.txt", // Default file name
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  if (filePath) {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
=======
async function saveFile(data) {
  const { content, filePath, saveAs } = data;
  
  if (!filePath || saveAs) {
    const { filePath: newFilePath } = await dialog.showSaveDialog({
      title: "Save File",
      defaultPath: filePath || "filename.txt",
      filters: [{ name: "Text Files", extensions: ["txt"] }],
>>>>>>> a0aaea26bf733f53ef5c54399a678249d937ada6
    });
    
    if (!newFilePath) return;
    
    await fs.promises.writeFile(newFilePath, content);
    return { filePath: newFilePath };
  }
  
  await fs.promises.writeFile(filePath, content);
  return { filePath }
}

module.exports = saveFile;
