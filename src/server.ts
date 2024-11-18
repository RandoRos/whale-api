import buildApp from './app';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
dotenv.config();

const app = buildApp();

async function start() {
  try {
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
