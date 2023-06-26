import { TradeInterface } from 'interfaces/trade';
import { ExchangeInterface } from 'interfaces/exchange';
import { GetQueryInterface } from 'interfaces';

export interface StockInterface {
  id?: string;
  symbol: string;
  exchange_id?: string;
  created_at?: any;
  updated_at?: any;
  trade?: TradeInterface[];
  exchange?: ExchangeInterface;
  _count?: {
    trade?: number;
  };
}

export interface StockGetQueryInterface extends GetQueryInterface {
  id?: string;
  symbol?: string;
  exchange_id?: string;
}
