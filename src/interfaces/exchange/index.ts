import { ReportInterface } from 'interfaces/report';
import { RiskLimitInterface } from 'interfaces/risk-limit';
import { StockInterface } from 'interfaces/stock';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ExchangeInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  report?: ReportInterface[];
  risk_limit?: RiskLimitInterface[];
  stock?: StockInterface[];
  user?: UserInterface;
  _count?: {
    report?: number;
    risk_limit?: number;
    stock?: number;
  };
}

export interface ExchangeGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
