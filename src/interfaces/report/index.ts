import { UserInterface } from 'interfaces/user';
import { ExchangeInterface } from 'interfaces/exchange';
import { GetQueryInterface } from 'interfaces';

export interface ReportInterface {
  id?: string;
  user_id?: string;
  exchange_id?: string;
  report_data: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  exchange?: ExchangeInterface;
  _count?: {};
}

export interface ReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  exchange_id?: string;
  report_data?: string;
}
