import Fastify from 'fastify';
import cors from '@fastify/cors';
import { RedisClientType, createClient } from 'redis';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
dotenv.config();

import priceRoutes from './routes/price.routes';
import auth from './middlewares/auth';

const app = Fastify({ logger: true });

app.register(cors);
app.register(priceRoutes, { prefix: 'api/prices' });
app.addHook('preHandler', auth);

app.get('/healthcheck', async () => {
  return { status: 'OK' };
});

async function start() {
  try {
    const redisClient = await createClient();
    await redisClient.connect();

    app.decorate('redis', redisClient as RedisClientType);

    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });
    console.log(
      `Server is running at http://localhost:${
        (app.server.address() as AddressInfo)['port']
      }`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
start();
