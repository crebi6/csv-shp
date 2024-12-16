import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { UPLOAD_DIR } from './constants.js';

export async function processUpload(request, allowedExtensions, multiple = false) {
  const data = await request.file();
  
  if (!data) {
    throw new Error('No file uploaded');
  }

  if (multiple) {
    const files = [];
    for await (const part of data) {
      const ext = part.filename.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
      }
      
      const filepath = join(UPLOAD_DIR, `${Date.now()}-${part.filename}`);
      await pipeline(part.file, createWriteStream(filepath));
      files.push({ ...part, filepath });
    }
    return files;
  } else {
    const ext = data.filename.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
    }
    
    const filepath = join(UPLOAD_DIR, `${Date.now()}-${data.filename}`);
    await pipeline(data.file, createWriteStream(filepath));
    return { ...data, filepath };
  }
}