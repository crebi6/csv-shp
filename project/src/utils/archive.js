import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { promises as fs } from 'fs';

export async function createZipArchive(sourceDir, outputPath) {
  return new Promise(async (resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    output.on('close', resolve);
    archive.on('error', reject);
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    await archive.finalize();
  });
}