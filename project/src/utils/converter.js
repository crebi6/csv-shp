import { parse } from 'fast-csv';
import { createReadStream } from 'fs';
import shapefile from 'shapefile';

export async function convertToGeoJson(filepath, headers) {
  return new Promise((resolve, reject) => {
    const features = [];
    const latField = headers.find(h => h.toLowerCase().includes('lat'));
    const lonField = headers.find(h => h.toLowerCase().includes('lon'));
    
    createReadStream(filepath)
      .pipe(parse({ headers: true }))
      .on('data', (row) => {
        const lat = parseFloat(row[latField]);
        const lon = parseFloat(row[lonField]);
        
        if (isNaN(lat) || isNaN(lon)) {
          return; // Skip invalid coordinates
        }
        
        const properties = { ...row };
        delete properties[latField];
        delete properties[lonField];
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          properties
        });
      })
      .on('end', () => {
        resolve({
          type: 'FeatureCollection',
          features
        });
      })
      .on('error', reject);
  });
}

export async function convertShapefileToFeatures(shpFile, dbfFile) {
  const features = [];
  const source = await shapefile.open(shpFile.filepath, dbfFile.filepath);
  
  let result;
  while ((result = await source.read()) && !result.done) {
    features.push(result.value);
  }
  
  return features;
}