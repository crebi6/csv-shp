import { promises as fs } from 'fs';
import { parse } from 'fast-csv';
import { createReadStream } from 'fs';

export async function validateCsvHeaders(filepath) {
  return new Promise((resolve, reject) => {
    const headers = [];
    const stream = createReadStream(filepath)
      .pipe(parse({ headers: true }))
      .on('headers', (csvHeaders) => {
        headers.push(...csvHeaders);
        
        // Validate required columns
        const hasLatitude = headers.some(h => 
          h.toLowerCase().includes('lat'));
        const hasLongitude = headers.some(h => 
          h.toLowerCase().includes('lon'));
        
        if (!hasLatitude || !hasLongitude) {
          reject(new Error('CSV must contain latitude and longitude columns'));
        }
        
        resolve(headers);
      })
      .on('error', reject);
      
    stream.end();
  });
}

export async function validateShapefiles(files) {
  const shpFile = files.find(f => f.filename.endsWith('.shp'));
  const dbfFile = files.find(f => f.filename.endsWith('.dbf'));
  
  if (!shpFile || !dbfFile) {
    throw new Error('Missing required Shapefile components (.shp and .dbf)');
  }
  
  return { shpFile, dbfFile };
}