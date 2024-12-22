import React from 'react';
import { Coin } from '../../page';
import './holdings-list.scss';

interface HoldingsListProps {
  coins: Coin[];
  userAssets: { id: string; amount: number }[];
}

const HoldingsList: React.FC<HoldingsListProps> = ({ coins, userAssets }) => {
  const holdings = userAssets.map(asset => {
    const coin = coins.find(c => c.id === asset.id);
    return {
      ...coin,
      holdings: asset.amount,
      value: coin ? coin.current_price * asset.amount : 0,
    };
  });

  return (
    <div className="holdings-list">
      <h2>Your Holdings</h2>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Holdings</th>
            <th>Current Price</th>
            <th>Value</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id}>
              <td>
                <div className="holdings-list__asset">
                  <img src={holding.image} alt={holding.name} className="holdings-list__icon" />
                  <span>{holding.name}</span>
                  <span className="holdings-list__symbol">{holding.symbol?.toUpperCase()}</span>
                </div>
              </td>
              <td>{holding.holdings.toLocaleString()}</td>
              <td>
                ${holding.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
              </td>
              <td>
                ${holding.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
              </td>
              <td
                className={
                  holding.price_change_percentage_24h !== undefined
                    ? holding.price_change_percentage_24h >= 0
                      ? 'positive'
                      : 'negative'
                    : ''
                }
              >
                {holding.price_change_percentage_24h !== undefined
                  ? `${holding.price_change_percentage_24h >= 0 ? '+' : ''}${holding.price_change_percentage_24h.toFixed(2)}%`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsList;
