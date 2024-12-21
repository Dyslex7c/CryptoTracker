'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import './crypto-price-ticker.scss'

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

const CryptoPriceTicker: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        )
        const data = await response.json()
        setCoins(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching coin data:', error)
        setLoading(false)
      }
    }

    fetchCoins()
    const interval = setInterval(fetchCoins, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (tickerRef.current) {
      const tickerWidth = tickerRef.current.scrollWidth
      let position = 0

      const animate = () => {
        position -= 1
        if (position <= -tickerWidth / 2) {
          position = 0
        }
        if (tickerRef.current) {
          tickerRef.current.style.transform = `translateX(${position}px)`
        }
        requestAnimationFrame(animate)
      }

      animate()
    }
  }, [coins])

  if (loading) {
    return <div className="crypto-price-ticker-loading">Loading ticker...</div>
  }

  return (
    <div className="crypto-price-ticker-container">
      <div className="crypto-price-ticker" ref={tickerRef}>
        {[...coins, ...coins].map((coin, index) => (
          <div key={`${coin.id}-${index}`} className="crypto-price-item">
            <img src={coin.image} alt={coin.name} className="crypto-icon" />
            <span className="crypto-name">{coin.name}</span>
            <span className="crypto-price">${coin.current_price.toFixed(2)}</span>
            <span
              className={`crypto-change ${
                coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'
              }`}
            >
              {coin.price_change_percentage_24h >= 0 ? (
                <ArrowUpIcon size={16} />
              ) : (
                <ArrowDownIcon size={16} />
              )}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CryptoPriceTicker

