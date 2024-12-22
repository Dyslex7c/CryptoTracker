import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Coin } from '../../page';
import './portfolio-summary.scss'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PortfolioSummaryProps {
  coins: Coin[];
  userAssets: { id: string; amount: number }[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ coins, userAssets }) => {
  const portfolioValue = useMemo(() => {
    return userAssets.reduce((total, asset) => {
      const coin = coins.find(c => c.id === asset.id);
      return total + (coin ? coin.current_price * asset.amount : 0);
    }, 0);
  }, [coins, userAssets]);

  const portfolioChange = useMemo(() => {
    const initialValue = userAssets.reduce((total, asset) => {
      const coin = coins.find(c => c.id === asset.id);
      if (coin) {
        const initialPrice = coin.current_price / (1 + coin.price_change_percentage_24h / 100);
        return total + initialPrice * asset.amount;
      }
      return total;
    }, 0);
    return ((portfolioValue - initialValue) / initialValue) * 100;
  }, [coins, userAssets, portfolioValue]);

  const chartData = useMemo(() => {
    const labels = ['7d', '6d', '5d', '4d', '3d', '2d', '1d', 'Now'];
    const data = new Array(8).fill(0);
    
    userAssets.forEach(asset => {
      const coin = coins.find(c => c.id === asset.id);
      if (coin && coin.sparkline_in_7d) {
        coin.sparkline_in_7d.price.forEach((price, index) => {
          data[index] += price * asset.amount;
        });
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [coins, userAssets]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="portfolio-summary">
      <div className="portfolio-summary__value">
        <h2>Total Portfolio Value</h2>
        <p className="portfolio-summary__amount">${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        <p className={`portfolio-summary__change ${portfolioChange >= 0 ? 'positive' : 'negative'}`}>
          {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
        </p>
      </div>
      <div className="portfolio-summary__chart">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default PortfolioSummary

