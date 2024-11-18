import { RedisClientType } from 'redis';

export const getOrSetCache = async (
  redisClient: RedisClientType,
  key: string,
  fn: any
) => {
  try {
    const cachedResults = await redisClient.get(key);
    if (cachedResults) return JSON.parse(cachedResults);
    const data = await fn();
    await redisClient.SETEX(
      key,
      Number(process.env.CACHE_EXPIRATION_TTL || 600),
      JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting cached data');
  }
};
