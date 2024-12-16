import geojson2shp from 'geojson2shp';
import { join } from 'path';

export async function generateShapefile(geoJson, outputDir) {
  return new Promise((resolve, reject) => {
    const options = {
      layer: 'converted_layer',
      targetCrs: 4326 // WGS84
    };
    
    geojson2shp.convert(geoJson, outputDir, options)
      .then(resolve)
      .catch(reject);
  });
}