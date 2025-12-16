const fs = require("fs/promises");
const path = require("path");

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tiff",
  ".avif",
]);

function isImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

async function getAllFiles(dirPath) {
  let fileList = [];

  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await getAllFiles(fullPath);
      fileList = fileList.concat(nestedFiles);
    } else {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

async function prepareFileTasks(inputDir, outputDir) {
  const absInputDir = path.resolve(inputDir);

  const allFiles = await getAllFiles(absInputDir);

  const imageFiles = allFiles.filter(isImage);

  if (imageFiles.length === 0) {
    throw new Error(`No image files found in ${absInputDir}`);
  }

  const tasks = imageFiles.map((sourcePath) => {
    let destinationPath;

    if (outputDir) {
      const relativePath = path.relative(absInputDir, sourcePath);

      destinationPath = path.join(path.resolve(outputDir), relativePath);
    } else {
      destinationPath = sourcePath;
    }

    return { source: sourcePath, destination: destinationPath };
  });

  return tasks;
}

module.exports = { prepareFileTasks };
