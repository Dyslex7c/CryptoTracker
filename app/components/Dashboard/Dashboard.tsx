'use client';

import { useState, useEffect } from 'react';
import CoinList from '../CoinList/CoinList';
import Chart from '../Chart/Chart';
import NewsWidget from '../NewsWidget/NewsWidget';
import CurrencyConverter from '../CurrencyConverter/CurrencyConverter';
import AdvancedAnalytics from '../Analytics/AdvancedAnalytics';
import CryptoPriceTicker from '../CryptoPriceTicker/CryptoPriceTicker';
import './dashboard.scss';
import SearchBar from '../SearchBar/SearchBar';

interface Coin {
  id: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  atl: number;
}

const Dashboard = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  console.log(searchTerm);
  
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        const data = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(
    (coin) => {
      console.log(coin.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    }
  );

  console.log(filteredCoins);
  

  const toggleFavorite = (coinId: string) => {
    setFavoriteCoins((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <div className='flex flex-row justify-between'>
        <header className="dashboard-header">
          <h1>Cryptocurrency Dashboard</h1>
        </header>
        <SearchBar onSearch={(term: string) => setSearchTerm(term)} />
      </div>
      <CryptoPriceTicker />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <CoinList
            coins={filteredCoins}
            onFavoriteToggle={toggleFavorite}
            favoriteCoins={favoriteCoins}
          />
          <div className="full-width-chart">
            <Chart coinId="bitcoin" coinName="Bitcoin" />
          </div>
          <div className="full-width-chart">
            <Chart coinId="ethereum" coinName="Ethereum" />
          </div>
          <div className="dashboard-widgets">
            <NewsWidget />
            <CurrencyConverter />
          </div>
          <AdvancedAnalytics />
        </>
      )}
    </div>
  );
};

export default Dashboard;
