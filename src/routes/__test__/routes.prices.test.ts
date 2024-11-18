import { test } from 'tap';
import sinon from 'sinon';
import { ImportMock } from 'ts-mock-imports';
import buildApp from '../../app';
import * as redis from 'redis';
import * as api from '../../api/api';

process.env.X_API_KEY = 'test-api-key';

const mockData = [
  {
    token: 'btc',
    price: 1000,
    currency: 'usdt',
    provider: 'coinmarketcap',
  },
];

const setexStub = sinon.stub();
const mockRedisClient = () => {
  return ImportMock.mockFunction(redis, 'createClient', {
    connect: () => Promise.resolve(),
    get: () => Promise.resolve(null),
    SETEX: setexStub,
  });
};

test('GET `/prices` - get prices', async (t) => {
  const redisMock = mockRedisClient();
  const app = buildApp();

  t.teardown(() => app.close());

  const s = ImportMock.mockFunction(api, 'fetchTokenPriceFromProvider', mockData);

  const response = await app.inject({
    method: 'GET',
    url: 'api/prices',
    headers: {
      'x-api-key': 'test-api-key',
    },
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), mockData);

  t.equal(setexStub.calledOnce, true);

  redisMock.restore();
  s.restore();
  setexStub.reset();
});
