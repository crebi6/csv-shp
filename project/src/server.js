import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyMultipart from '@fastify/multipart';
import FastifyCors from '@fastify/cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupDirectories } from './utils/fileSystem.js';
import { registerRoutes } from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildApp() {
  const fastify = Fastify({
    logger: true
  });

  // Register plugins
  await fastify.register(FastifyCors);
  await fastify.register(FastifyMultipart);
  await fastify.register(FastifyStatic, {
    root: join(__dirname, '../public'),
    prefix: '/'
  });

  // Setup required directories
  await setupDirectories();

  // Register routes
  registerRoutes(fastify);

  return fastify;
}

// Start the server
const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();