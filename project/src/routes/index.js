import { csvRoutes } from './csvRoutes.js';
import { shapefileRoutes } from './shapefileRoutes.js';
import { downloadRoutes } from './downloadRoutes.js';

export function registerRoutes(fastify) {
  csvRoutes(fastify);
  shapefileRoutes(fastify);
  downloadRoutes(fastify);
}