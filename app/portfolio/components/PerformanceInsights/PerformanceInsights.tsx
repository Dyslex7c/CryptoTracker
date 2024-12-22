import React, { useMemo } from 'react';
import { Coin } from '../../page';
import './performance-insights.scss';

interface PerformanceInsightsProps {
  coins: Coin[];
  userAssets: { id: string; amount: number }[];
}

const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({ coins, userAssets }) => {
  const insights = useMemo(() => {
    const holdings = userAssets.map(asset => {
      const coin = coins.find(c => c.id === asset.id);
      return {
        ...coin,
        holdings: asset.amount,
        value: coin ? coin.current_price * asset.amount : 0,
        change24h: coin && coin.price_change_percentage_24h !== undefined
          ? (coin.price_change_percentage_24h / 100) * coin.current_price * asset.amount
          : 0,
      };
    });

    const bestPerforming = holdings.reduce((best, current) => 
      (current.price_change_percentage_24h ?? -Infinity) > (best.price_change_percentage_24h ?? -Infinity) ? current : best
    );

    const worstPerforming = holdings.reduce((worst, current) => 
      (current.price_change_percentage_24h ?? Infinity) < (worst.price_change_percentage_24h ?? Infinity) ? current : worst
    );

    const topGain = holdings.reduce((top, current) => 
      (current.change24h > top.change24h) ? current : top
    );

    return { bestPerforming, worstPerforming, topGain };
  }, [coins, userAssets]);

  return (
    <div className="performance-insights">
      <h2>Performance Insights</h2>
      <div className="performance-insights__grid">
        <div className="performance-insights__card">
          <h3>Best Performing Asset</h3>
          <p className="performance-insights__asset">
            {insights.bestPerforming.name} ({insights.bestPerforming.symbol?.toUpperCase()})
          </p>
          <p className="performance-insights__value positive">
            +{(insights.bestPerforming.price_change_percentage_24h ?? 0).toFixed(2)}%
          </p>
        </div>
        <div className="performance-insights__card">
          <h3>Worst Performing Asset</h3>
          <p className="performance-insights__asset">
            {insights.worstPerforming.name} ({insights.worstPerforming.symbol?.toUpperCase()})
          </p>
          <p className="performance-insights__value negative">
            {(insights.worstPerforming.price_change_percentage_24h ?? 0).toFixed(2)}%
          </p>
        </div>
        <div className="performance-insights__card">
          <h3>Top Gain in USD</h3>
          <p className="performance-insights__asset">
            {insights.topGain.name} ({insights.topGain.symbol?.toUpperCase()})
          </p>
          <p className="performance-insights__value positive">
            ${(insights.topGain.change24h ?? 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
