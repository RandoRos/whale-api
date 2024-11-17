export type CoinmarketcapApiResponse = {
  data: CoinMetadata[];
  status: any;
};

type CoinMetadata = {
  tags: any[];
  id: number;
  symbol: string;
  quote: any[];
};

type ProviderTokenObject = {
  token: string;
  price: number;
  currency: string;
};

export interface Provider {
  name: string;
  fetchTokenPrice(
    token?: string | string[],
    curency?: string
  ): Promise<ProviderTokenObject | ProviderTokenObject[]>;
}
