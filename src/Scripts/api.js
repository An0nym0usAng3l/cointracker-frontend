export const coinList = (page) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem&order=market_cap_desc&per_page=100&page=${page}&sparkline=false&price_change_percentage=1h%2C24h`;

export const singleCoin = (id) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;

export const getHistoricalData = (id, days) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;


