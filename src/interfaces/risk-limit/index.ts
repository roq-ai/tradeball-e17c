import { UserInterface } from 'interfaces/user';
import { ExchangeInterface } from 'interfaces/exchange';
import { GetQueryInterface } from 'interfaces';

export interface RiskLimitInterface {
  id?: string;
  user_id?: string;
  exchange_id?: string;
  limit_value: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  exchange?: ExchangeInterface;
  _count?: {};
}

export interface RiskLimitGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  exchange_id?: string;
}
