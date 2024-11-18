import path from 'node:path';
import Fastify, { FastifyInstance, FastifyHttpOptions } from 'fastify';
import autoload from '@fastify/autoload';

const buildApp = () => {
  const app: FastifyInstance = Fastify({ logger: true });

  app.register(import('@fastify/cors'));
  app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  });
  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api/' },
  });

  return app;
};

export default buildApp;
