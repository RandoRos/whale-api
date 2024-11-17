import { FastifyInstance } from 'fastify';
import { RedisClientType } from 'redis';

import { getAllPrices, getTokenPrice } from '../controllers/price.controller';

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType;
  }
}

const routes = async (server: FastifyInstance) => {
  server.get('/', async (request, reply) => {
    const redisClient = server.redis;
    return getAllPrices(request, reply, redisClient);
  });
  server.get<{
    Params: { token: string };
  }>('/:token', async (request, reply) => {
    const redisClient = server.redis;
    return getTokenPrice(request, reply, redisClient);
  });
};

export default routes;
