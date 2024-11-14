import Fastify from 'fastify';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
dotenv.config();

const app = Fastify({ logger: true });

app.get('/healthcheck', async () => {
  return { status: 'OK' };
});

async function start() {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000 });
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
