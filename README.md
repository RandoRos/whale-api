# Whale API

This is a basic API which fetches cryptocurrency data from 3rd party providers and returns current price information. It caches data to increase request speed and reduce cost from providers, using `redis`.

Caching using redis simply because it is lightweight and fast caching solution. Since we do not have presistent data, there is no need to use any databse for this.

API using auth for all its endpoints, via auth header `x-api-key`which value can be set by using environment variables `X_API_KEY`

#### Stack
`node` `typescript` `fastify` `tap` `redis` `axios`

### Variables

Create `.env`file into project `<root>` folder

- COINMARKETCAP_API_KEY - `required`, CoinMarketCap API key
- X_API_KEY - `required`, API auth header key, need to be set same for UI
- CACHE_EXPIRATION_TTL - seconds, data caching time, default 600 seconds (10 min)

### Endpoints
- /healthcheck - basic healthcheck route to check api status
- /api/prices - returns list of suported cryptocurrencies/tokens
- /api/prices/:token - returns detailed info for a single token

### Running - Local

To run local

1. Run command `npm install`
2. Create `.env` file into root of the project, add required variables
3. Run `redis server` in your local machine or docker container
3. Run command `npm start`

### Running - Docker

To run via Docker, just run command 

```docker
docker-compose up --build
-or--
docker compose up --build
```
depending which docker provider and version using.


