import React, { useState, useEffect } from 'react'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import "./coin-modal.scss"

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  high_24h: number
  low_24h: number
  ath: number
  atl: number
  market_cap_rank?: number // Added market_cap_rank to Coin interface
}

interface CoinModalProps {
  coin: Coin
}

const CoinModal: React.FC<CoinModalProps> = ({ coin }) => {
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setShowModal(true)
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="coin-modal-grid">
            <div className="coin-modal-item">
              <p className="coin-modal-label">24h Change:</p>
              <p className={coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">Market Cap:</p>
              <p>{formatCurrency(coin.market_cap)}</p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">24h High:</p>
              <p>{formatCurrency(coin.high_24h)}</p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">24h Low:</p>
              <p>{formatCurrency(coin.low_24h)}</p>
            </div>
          </div>
        )
      case 'details':
        return (
          <div className="coin-modal-grid">
            <div className="coin-modal-item">
              <p className="coin-modal-label">All-Time High:</p>
              <p>{formatCurrency(coin.ath)}</p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">All-Time Low:</p>
              <p>{formatCurrency(coin.atl)}</p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">Total Volume:</p>
              <p>{formatCurrency(coin.total_volume)}</p>
            </div>
            <div className="coin-modal-item">
              <p className="coin-modal-label">Market Cap Rank:</p>
              <p>#{coin.market_cap_rank}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`coin-modal ${showModal ? 'show' : ''}`} style={{ pointerEvents: 'none' }}>
      <div className="coin-modal-header">
        <h2 className="coin-modal-title">
          <img src={coin.image} alt={coin.name} className="coin-modal-icon" />
          {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
        <p className="coin-modal-price">{formatCurrency(coin.current_price)}</p>
      </div>
      <div className="coin-modal-tabs" style={{ pointerEvents: 'auto' }}>
        <button
          className={`coin-modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`coin-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>
      <div className="coin-modal-content">
        {renderTabContent()}
      </div>
      <div className="coin-modal-footer" style={{ pointerEvents: 'auto' }}>
        <a href={`https://www.coingecko.com/en/coins/${coin.id}`} target="_blank" rel="noopener noreferrer" className="coin-modal-link">
          View on CoinGecko
        </a>
      </div>
    </div>
  )
}

export default CoinModal

