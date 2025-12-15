const fs = require("node:fs");
const path = require("node:path");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".tiff"];

function readFile(inputPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(inputPath, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      const imagePaths = value
        .filter((val) =>
          allowedExtensions.includes(path.extname(val).toLowerCase())
        )
        .map((val) => path.join(inputPath, val));
      resolve(imagePaths);
    });
  });
}

module.exports = { readFile };
