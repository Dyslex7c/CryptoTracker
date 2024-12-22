import React, { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Coin } from '../../page';
import './asset-breakdown.scss'

ChartJS.register(ArcElement, Tooltip, Legend)

interface AssetBreakdownProps {
  coins: Coin[];
  userAssets: { id: string; amount: number }[];
}

const AssetBreakdown: React.FC<AssetBreakdownProps> = ({ coins, userAssets }) => {
  const data = useMemo(() => {
    const assetValues = userAssets.map(asset => {
      const coin = coins.find(c => c.id === asset.id);
      return {
        name: coin ? coin.name : asset.id,
        value: coin ? coin.current_price * asset.amount : 0,
      };
    });

    const totalValue = assetValues.reduce((sum, asset) => sum + asset.value, 0);

    return {
      labels: assetValues.map(asset => asset.name),
      datasets: [
        {
          data: assetValues.map(asset => (asset.value / totalValue) * 100),
          backgroundColor: [
            'rgb(255, 52, 52)',
            'rgb(72, 122, 155)',
            'rgb(238, 0, 0)',
            'rgb(0, 255, 255)',
            'rgb(38, 0, 255)',
          ],
        },
      ],
    };
  }, [coins, userAssets]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255)',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="asset-breakdown">
      <h2>Asset Breakdown</h2>
      <div className="asset-breakdown__chart">
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}

export default AssetBreakdown

