import { promises as fs } from 'fs';
import shapefile from 'shapefile';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { format } from 'fast-csv';
import { CONVERTED_DIR } from '../utils/constants.js';
import { validateShapefiles } from '../utils/validators.js';
import { convertShapefileToFeatures } from '../utils/converter.js';

export async function convertShapefileToCSV(files) {
  try {
    // Validate shapefile components
    const { shpFile, dbfFile } = await validateShapefiles(files);
    
    // Convert Shapefile to features
    const features = await convertShapefileToFeatures(shpFile, dbfFile);
    
    // Generate CSV file
    const csvPath = join(CONVERTED_DIR, `${Date.now()}-output.csv`);
    await generateCSV(features, csvPath);
    
    return {
      message: 'Shapefile successfully converted to CSV',
      downloadUrl: `/download/${csvPath.split('/').pop()}`
    };
  } catch (error) {
    throw new Error(`Shapefile conversion failed: ${error.message}`);
  }
}

async function generateCSV(features, outputPath) {
  return new Promise((resolve, reject) => {
    const csvStream = format({ headers: true });
    const writeStream = createWriteStream(outputPath);
    
    csvStream.pipe(writeStream);
    
    features.forEach(feature => {
      const row = {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        ...feature.properties
      };
      csvStream.write(row);
    });
    
    csvStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}