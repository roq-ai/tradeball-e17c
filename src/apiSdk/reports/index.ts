import axios from 'axios';
import queryString from 'query-string';
import { ReportInterface, ReportGetQueryInterface } from 'interfaces/report';
import { GetQueryInterface } from '../../interfaces';

export const getReports = async (query?: ReportGetQueryInterface) => {
  const response = await axios.get(`/api/reports${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createReport = async (report: ReportInterface) => {
  const response = await axios.post('/api/reports', report);
  return response.data;
};

export const updateReportById = async (id: string, report: ReportInterface) => {
  const response = await axios.put(`/api/reports/${id}`, report);
  return response.data;
};

export const getReportById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/reports/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteReportById = async (id: string) => {
  const response = await axios.delete(`/api/reports/${id}`);
  return response.data;
};
