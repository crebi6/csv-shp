import { promises as fs } from 'fs';
import { parse } from 'fast-csv';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { CONVERTED_DIR } from '../utils/constants.js';
import { validateCsvHeaders } from '../utils/validators.js';
import { createZipArchive } from '../utils/archive.js';
import { convertToGeoJson } from '../utils/converter.js';
import { generateShapefile } from '../utils/shapefileGenerator.js';

export async function convertCsvToShapefile(file) {
  try {
    // Read and validate CSV
    const headers = await validateCsvHeaders(file.filepath);
    
    // Convert CSV to GeoJSON
    const geoJson = await convertToGeoJson(file.filepath, headers);
    
    // Generate unique output directory
    const outputDir = join(CONVERTED_DIR, `shapefile-${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate Shapefile
    await generateShapefile(geoJson, outputDir);
    
    // Create ZIP archive
    const zipPath = join(CONVERTED_DIR, `${Date.now()}-shapefile.zip`);
    await createZipArchive(outputDir, zipPath);
    
    // Clean up temporary files
    await fs.rm(outputDir, { recursive: true, force: true });
    
    return {
      message: 'CSV successfully converted to Shapefile',
      downloadUrl: `/download/${zipPath.split('/').pop()}`
    };
  } catch (error) {
    throw new Error(`CSV conversion failed: ${error.message}`);
  }
}