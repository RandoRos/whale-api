import { Provider } from '../types';

export enum SupportedTokens {
  BTC = 'btc',
  ETH = 'eth',
  TON = 'ton',
}

export enum SupportedCurrencies {
  USD = 'USD',
  EUR = 'EUR',
  USDT = 'USDT',
}

type coinPriceParams = {
  token?: string | string[];
  currency?: string;
};

export const fetchTokenPriceFromProvider = async (
  provider: Provider,
  { token, currency }: coinPriceParams = {}
) => {
  try {
    const response = await provider.fetchTokenPrice(token, currency);
    return response;
  } catch (error: any) {
    console.error(
      `Error: ${error.response?.status} ${error.response?.statusText} data: ${
        error.response?.data && JSON.stringify(error.response?.data)
      }`
    );
    throw new Error('Error response from Provider API');
  }
};
