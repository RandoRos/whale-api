import path from 'node:path';
import { RedisClientType } from 'redis';
import Fastify, { FastifyInstance, FastifyHttpOptions } from 'fastify';
import autoload from '@fastify/autoload';

import auth from './middlewares/auth';

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType;
  }
}

const buildApp = () => {
  const app: FastifyInstance = Fastify({ logger: true });

  app.addHook('preHandler', auth);
  app.get('/healthcheck', async () => {
    return { status: 'OK' };
  });

  app.register(import('@fastify/cors'));
  app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    ignorePattern: /.*\.(test|spec)\.[tj]s$/,
  });
  app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api/' },
    ignorePattern: /.*\.(test|spec)\.[tj]s$/,
  });

  return app;
};

export default buildApp;
