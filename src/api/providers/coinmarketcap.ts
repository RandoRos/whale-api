import axios from 'axios';
import { Provider, CoinmarketcapApiResponse } from '../../types';
import { SupportedCurrencies, SupportedTokens } from '../api';

enum TokenToIdMap {
  BTC = 1,
  ETH = 1027,
  TON = 11419,
}

export const coinmarketcapApi = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
  },
});

const getTokenIdBySymbol = (symbol: string): number | undefined => {
  return TokenToIdMap[symbol.toUpperCase() as keyof typeof TokenToIdMap];
};

const getTokenParams = (token: string | string[]) => {
  if (Array.isArray(token)) {
    return token
      .map((t) => getTokenIdBySymbol(t))
      .filter((id) => typeof id === 'number')
      .join(',');
  }
  return getTokenIdBySymbol(token);
};

const CoinMarketCapProvider: Provider = {
  name: 'coinmarketcap',
  fetchTokenPrice: async (token?: string | string[], currency?: string) => {
    const response = await coinmarketcapApi.get<CoinmarketcapApiResponse>(
      '/v3/cryptocurrency/quotes/latest',
      {
        params: {
          id: getTokenParams(token || Object.values(SupportedTokens)),
          convert: SupportedCurrencies.USDT,
        },
      }
    );
    const { data } = response.data;
    if (data.length === 1) {
      return {
        token: data[0].symbol,
        price: data[0].quote[0].price,
        currency: data[0].quote[0].symbol,
        provider: CoinMarketCapProvider.name,
      };
    } else {
      return data.map(({ quote, symbol }) => {
        return {
          token: symbol,
          price: quote[0].price,
          currency: quote[0].symbol,
          provider: CoinMarketCapProvider.name,
        };
      });
    }
  },
};

export default CoinMarketCapProvider;
