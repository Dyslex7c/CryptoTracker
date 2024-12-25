'use client'

import React, { useState, useEffect } from 'react'
import PortfolioSummary from './components/PortfolioSummary/PortfolioSummary'
import AssetBreakdown from './components/AssetBreakdown/AssetBreakdown'
import HoldingsList from './components/HoldingsList/HoldingsList'
import RecentTransactions from './components/RecentTransactions/RecentTransactions'
import PerformanceInsights from './components/PerformanceInsights/PerformanceInsights'
import AddAssetButton from './components/AddAssetButton/AddAssetButton'
import AddTransactionButton from './components/AddTransactionButton/AddTransactionButton'
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

export interface UserAsset {
  id: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'transfer';
  asset: string;
  amount: number;
  value: number;
}

const initialUserAssets: UserAsset[] = [
  { id: 'bitcoin', amount: 0.5 },
  { id: 'ethereum', amount: 2 },
  { id: 'avalanche-2', amount: 50 },
  { id: 'tether', amount: 1000 },
  { id: 'solana', amount: 20 },
];

const initialTransactions: Transaction[] = [
  { id: '1', date: '2023-04-15 14:30', type: 'buy', asset: 'BTC', amount: 0.5, value: 22500 },
  { id: '2', date: '2023-04-14 10:15', type: 'sell', asset: 'ETH', amount: 2, value: 6000 },
  { id: '3', date: '2023-04-13 18:45', type: 'transfer', asset: 'ADA', amount: 1000, value: 1200 },
  { id: '4', date: '2023-04-12 09:00', type: 'buy', asset: 'DOT', amount: 50, value: 1000 },
  { id: '5', date: '2023-04-11 16:20', type: 'sell', asset: 'SOL', amount: 10, value: 1500 },
];

const PortfolioPage: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [userAssets, setUserAssets] = useState<UserAsset[]>(initialUserAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
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
  }, [userAssets]);

  const addAsset = (newAsset: UserAsset) => {
    setUserAssets(prevAssets => {
      const existingAssetIndex = prevAssets.findIndex(asset => asset.id === newAsset.id);
      if (existingAssetIndex !== -1) {
        const updatedAssets = [...prevAssets];
        updatedAssets[existingAssetIndex].amount += newAsset.amount;
        return updatedAssets;
      } else {
        return [...prevAssets, newAsset];
      }
    });
  };

  const addTransaction = (newTransaction: Transaction) => {
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
    
    // Update user assets based on the transaction
    setUserAssets(prevAssets => {
      const updatedAssets = [...prevAssets];
      const assetIndex = updatedAssets.findIndex(asset => asset.id === newTransaction.asset);
      
      if (assetIndex !== -1) {
        if (newTransaction.type === 'buy' || newTransaction.type === 'transfer') {
          updatedAssets[assetIndex].amount += newTransaction.amount;
        } else if (newTransaction.type === 'sell') {
          updatedAssets[assetIndex].amount -= newTransaction.amount;
        }
      } else if (newTransaction.type === 'buy' || newTransaction.type === 'transfer') {
        updatedAssets.push({ id: newTransaction.asset, amount: newTransaction.amount });
      }
      
      return updatedAssets;
    });
  };

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
      <RecentTransactions transactions={transactions} />
      <div className="portfolio-page__actions">
        <AddAssetButton onAddAsset={addAsset} coins={coins} />
        <AddTransactionButton onAddTransaction={addTransaction} coins={coins} />
      </div>
    </div>
  )
}

export default PortfolioPage

