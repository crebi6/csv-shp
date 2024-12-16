import { convertCsvToShapefile } from '../services/csvService.js';
import { processUpload } from '../utils/upload.js';

export function csvRoutes(fastify) {
  fastify.post('/api/convert-to-shapefile', async (request, reply) => {
    try {
      const file = await processUpload(request, ['csv']);
      if (!file) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      const result = await convertCsvToShapefile(file);
      return result;
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });
}