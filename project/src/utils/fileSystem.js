import { promises as fs } from 'fs';
import { UPLOAD_DIR, CONVERTED_DIR, PUBLIC_DIR } from './constants.js';

const REQUIRED_DIRECTORIES = [
  UPLOAD_DIR,
  CONVERTED_DIR,
  PUBLIC_DIR
];

export async function setupDirectories() {
  try {
    await Promise.all(
      REQUIRED_DIRECTORIES.map(async (dir) => {
        try {
          await fs.access(dir);
        } catch {
          await fs.mkdir(dir, { recursive: true });
        }
      })
    );
  } catch (error) {
    console.error('Error setting up directories:', error);
    throw error;
  }
}