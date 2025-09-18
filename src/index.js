import Fastify from 'fastify';
import { config } from './config.js';

const fastify = Fastify({
  logger: config.logger,
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: config.host });
    console.log(`Server running at http://${config.host}:${config.port} in ${config.env} mode`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();