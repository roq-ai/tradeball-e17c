import axios from 'axios';
import queryString from 'query-string';
import { StockInterface, StockGetQueryInterface } from 'interfaces/stock';
import { GetQueryInterface } from '../../interfaces';

export const getStocks = async (query?: StockGetQueryInterface) => {
  const response = await axios.get(`/api/stocks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStock = async (stock: StockInterface) => {
  const response = await axios.post('/api/stocks', stock);
  return response.data;
};

export const updateStockById = async (id: string, stock: StockInterface) => {
  const response = await axios.put(`/api/stocks/${id}`, stock);
  return response.data;
};

export const getStockById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/stocks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStockById = async (id: string) => {
  const response = await axios.delete(`/api/stocks/${id}`);
  return response.data;
};
