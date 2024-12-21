import { useState } from 'react';
import CustomTable from '../CustomTable/CustomTable';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import "./coin-list.scss"

interface Coin {
  market_cap_rank: number;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

const CoinList = ({ coins }: { coins: Coin[] }) => {
  const [sortedCoins, setSortedCoins] = useState(coins);

  const handleSort = (key: keyof Coin, direction: 'asc' | 'desc') => {
    const sorted = [...sortedCoins].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedCoins(sorted);
  };

  const columns: Column<Coin>[] = [
    { key: 'market_cap_rank', label: 'Rank', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, coin: Coin) => (
        <div className="coin-name">
          <img src={coin.image} alt={coin.name} className="coin-icon" />
          <span>{value}</span>
          <span className="coin-symbol">({coin.symbol.toUpperCase()})</span>
        </div>
      ),
    },
    {
      key: 'current_price',
      label: 'Price',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'price_change_percentage_24h',
      label: '24h %',
      sortable: true,
      render: (value: number) => (
        <span className={value > 0 ? 'positive' : 'negative'}>
          {formatPercentage(value)}
        </span>
      ),
    },
    {
      key: 'market_cap',
      label: 'Market Cap',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'total_volume',
      label: 'Volume (24h)',
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="coin-list">
      <CustomTable columns={columns} data={sortedCoins} onSort={handleSort} />
    </div>
  );
};

export default CoinList;

