import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { RedisClientType } from 'redis';
import {
  getAllPrices,
  getTokenPrice,
} from '../../controllers/price.controller';

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType;
  }
}

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get('/', async (request, reply) => {
    const redisClient = fastify.redis;
    return getAllPrices(request, reply, redisClient);
  });
  fastify.get<{
    Params: { token: string };
  }>('/:token', async (request, reply) => {
    const redisClient = fastify.redis;
    return getTokenPrice(request, reply, redisClient);
  });
}
