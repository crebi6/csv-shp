import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');

export const UPLOAD_DIR = join(PROJECT_ROOT, 'uploads');
export const CONVERTED_DIR = join(PROJECT_ROOT, 'converted');
export const PUBLIC_DIR = join(PROJECT_ROOT, 'public');