const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

async function compressImage(task, options) {
  const { source, destination } = task;

  try {
    const stats = await fs.stat(source);
    const originalSize = stats.size;

    const outputDir = path.dirname(destination);
    
    await fs.mkdir(outputDir, { recursive: true });

    
    const ext = path.extname(source).toLowerCase();
    
    let pipeline = sharp(source);

    const quality = parseInt(options.quality);

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: quality, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: quality, compressionLevel: 8 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: quality });
    }
    
    const isInPlace = source === destination;
    const finalDest = isInPlace ? `${destination}.tmp-${Date.now()}` : destination;

    await pipeline.toFile(finalDest);

    if (isInPlace) {
      await fs.rename(finalDest, source);
    }

    const newStats = await fs.stat(destination);
    
    return {
      file: path.basename(source),
      originalSize: originalSize,
      newSize: newStats.size,
      saved: originalSize - newStats.size
    };

  } catch (error) {
    throw new Error(`Failed to process ${path.basename(source)}: ${error.message}`);
  }
}

module.exports = { compressImage };