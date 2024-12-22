const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCoinData(coinIds: string[]) {
  const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`);
  return await response.json();
}

export async function fetchGlobalData() {
  const response = await fetch(`${API_BASE_URL}/global`);
  return await response.json();
}

