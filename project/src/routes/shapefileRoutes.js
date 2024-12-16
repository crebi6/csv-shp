import { convertShapefileToCSV } from '../services/shapefileService.js';
import { processUpload } from '../utils/upload.js';

export function shapefileRoutes(fastify) {
  fastify.post('/api/convert-to-csv', async (request, reply) => {
    try {
      const files = await processUpload(request, ['shp', 'shx', 'dbf'], true);
      if (!files || files.length === 0) {
        return reply.code(400).send({ error: 'No files uploaded' });
      }

      const result = await convertShapefileToCSV(files);
      return result;
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });
}