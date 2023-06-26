import axios from 'axios';
import queryString from 'query-string';
import { RiskLimitInterface, RiskLimitGetQueryInterface } from 'interfaces/risk-limit';
import { GetQueryInterface } from '../../interfaces';

export const getRiskLimits = async (query?: RiskLimitGetQueryInterface) => {
  const response = await axios.get(`/api/risk-limits${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRiskLimit = async (riskLimit: RiskLimitInterface) => {
  const response = await axios.post('/api/risk-limits', riskLimit);
  return response.data;
};

export const updateRiskLimitById = async (id: string, riskLimit: RiskLimitInterface) => {
  const response = await axios.put(`/api/risk-limits/${id}`, riskLimit);
  return response.data;
};

export const getRiskLimitById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/risk-limits/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRiskLimitById = async (id: string) => {
  const response = await axios.delete(`/api/risk-limits/${id}`);
  return response.data;
};
