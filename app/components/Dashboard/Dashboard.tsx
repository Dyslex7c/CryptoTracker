'use client'

import { useState, useEffect } from 'react'
import CoinList from '../CoinList/CoinList'
import Chart from '../Chart/Chart'
import NewsWidget from '../NewsWidget/NewsWidget'
import CurrencyConverter from '../CurrencyConverter/CurrencyConverter'
import AdvancedAnalytics from '../Analytics/AdvancedAnalytics'
import CryptoPriceTicker from '../CryptoPriceTicker/CryptoPriceTicker'
import "./dashboard.scss"

const Dashboard = () => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        const data = await response.json()
        setCoins(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching coin data:', error)
        setLoading(false)
      }
    }

    fetchCoins()
    const interval = setInterval(fetchCoins, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <h1>Cryptocurrency Dashboard</h1>
      </header>
      <CryptoPriceTicker />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <CoinList coins={coins} />
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
  )
}

export default Dashboard

