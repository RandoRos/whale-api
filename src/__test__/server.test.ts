import { test } from 'tap';
import { ImportMock } from 'ts-mock-imports';
import buildApp from '../app';
import * as redis from 'redis';

process.env.X_API_KEY = 'test-api-key';

const mockRedisClient = () => {
  return ImportMock.mockFunction(redis, 'createClient', {
    connect: () => Promise.resolve(),
  });
};

test('GET `/healthcheck` - get healtcheck result with correct api key', async (t) => {
  const s = mockRedisClient();
  const app = buildApp();

  t.teardown(() => app.close());

  const response = await app.inject({
    method: 'GET',
    url: '/healthcheck',
    headers: {
      'x-api-key': 'test-api-key',
    },
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { status: 'OK' });
  s.restore();
});

test('GET `/healthcheck` - get healtcheck result with incorrect api key', async (t) => {
  const s = mockRedisClient();
  const app = buildApp();

  t.teardown(() => app.close());

  const response = await app.inject({
    method: 'GET',
    url: '/healthcheck',
    headers: {
      'x-api-key': 'blah',
    },
  });

  t.equal(response.statusCode, 401);
  t.same(response.json(), { message: 'Unauthorized' });
  s.restore();
});