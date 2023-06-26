const mapping: Record<string, string> = {
  exchanges: 'exchange',
  reports: 'report',
  'risk-limits': 'risk_limit',
  stocks: 'stock',
  trades: 'trade',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
