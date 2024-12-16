import { join } from 'path';
import { createReadStream } from 'fs';
import { CONVERTED_DIR } from '../utils/constants.js';

export function downloadRoutes(fastify) {
  fastify.get('/download/:filename', async (request, reply) => {
    try {
      const { filename } = request.params;
      const filepath = join(CONVERTED_DIR, filename);
      
      return reply.type('application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(createReadStream(filepath));
    } catch (error) {
      return reply.code(404).send({ error: 'File not found' });
    }
  });
}