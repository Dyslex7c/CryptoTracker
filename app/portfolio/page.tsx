'use client'

import React, { useState, useEffect } from 'react'
import PortfolioSummary from './components/PortfolioSummary/PortfolioSummary'
import AssetBreakdown from './components/AssetBreakdown/AssetBreakdown'
import HoldingsList from './components/HoldingsList/HoldingsList'
import RecentTransactions from './components/RecentTransactions/RecentTransactions'
import PerformanceInsights from './components/PerformanceInsights/PerformanceInsights'
import AddAssetButton from './components/AddAssetButton/AddAssetButton'
import { fetchCoinData } from '../utils/api'
import './portfolio.scss'

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: { price: number[] };
}

const userAssets = [
  { id: 'bitcoin', amount: 0.5 },
  { id: 'ethereum', amount: 2 },
  { id: 'avalanche-2', amount: 50 },
  { id: 'tether', amount: 1000 },
  { id: 'solana', amount: 20 },
];

const PortfolioPage: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinIds = userAssets.map(asset => asset.id);
        const data = await fetchCoinData(coinIds);
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="portfolio-page">
      <h1 className="portfolio-page__title">My Portfolio</h1>
      <div className="portfolio-page__grid">
        <div className="portfolio-page__main">
          <PortfolioSummary coins={coins} userAssets={userAssets} />
          <HoldingsList coins={coins} userAssets={userAssets} />
        </div>
        <div className="portfolio-page__sidebar">
          <AssetBreakdown coins={coins} userAssets={userAssets} />
          <PerformanceInsights coins={coins} userAssets={userAssets} />
        </div>
      </div>
      <RecentTransactions />
      <AddAssetButton />
    </div>
  )
}

export default PortfolioPage

