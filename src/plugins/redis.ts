import fp from 'fastify-plugin';
import { createClient, RedisClientType } from 'redis';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function redisPlugin(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  const port = process.env.REDIS_PORT || 6379;
  const host = process.env.REDIS_HOST || 'localhost';
  const redisClient = await createClient({
    url: `redis://${host}:${port}`,
  });
  await redisClient.connect();

  fastify.decorate('redis', redisClient as RedisClientType);
}

export default fp(redisPlugin);
