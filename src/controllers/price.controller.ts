import { FastifyReply, FastifyRequest } from 'fastify';
import { RedisClientType } from 'redis';

import { getOrSetCache } from '../utils';
import { fetchTokenPriceFromProvider, SupportedTokens } from '../api/api';

import CoinMarketCapProvider from '../api/providers/coinmarketcap';

export const getAllPrices = async (
  request: FastifyRequest,
  reply: FastifyReply,
  redisClient: RedisClientType
) => {
  try {
    const cachedResults = await redisClient.get('prices');
    if (cachedResults) {
      return JSON.parse(cachedResults);
    } else {
      const resp = await fetchTokenPriceFromProvider(CoinMarketCapProvider);
      await redisClient.SETEX(
        'prices',
        Number(process.env.CACHE_EXPIRATION_TTL!),
        JSON.stringify(resp)
      );
      return resp;
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send('Internal Server Error');
  }
};

interface IPriceParams {
  token: string;
}

export const getTokenPrice = async (
  request: FastifyRequest<{
    Params: IPriceParams;
  }>,
  reply: FastifyReply,
  redisClient: RedisClientType
) => {
  try {
    const { token } = request.params;
    if (!Object.values(SupportedTokens).includes(token as SupportedTokens)) {
      reply.status(400).send('Token is not supported');
    }

    const data = await getOrSetCache(redisClient, `price:${token}`, async () => {
      return await fetchTokenPriceFromProvider(CoinMarketCapProvider, {
        token,
      })
    });
    return data;
  } catch (error) {
    console.error(error);
    reply.status(500).send('Internal Server Error');
  }
};