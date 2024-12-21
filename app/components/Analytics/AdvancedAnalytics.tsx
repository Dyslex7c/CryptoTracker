'use client'

import { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Sun, Moon } from 'lucide-react'
import "./advanced-analytics.scss"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type FearGreedHistoryItem = {
  timestamp: string
  value: string
}

const AdvancedAnalytics = () => {
  const [marketData, setMarketData] = useState({
    fearGreedIndex: 0,
    fearGreedValue: '',
    btcDominance: 0,
    totalMarketCap: '',
    volume24h: '',
  })
  const [fearGreedHistory, setFearGreedHistory] = useState<FearGreedHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const analyticsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [globalData, fearGreedData, fearGreedHistoryData] = await Promise.all([
          fetch('https://api.coingecko.com/api/v3/global').then(res => res.json()),
          fetch('https://api.alternative.me/fng/').then(res => res.json()),
          fetch('https://api.alternative.me/fng/?limit=30').then(res => res.json())
        ])

        setMarketData({
          fearGreedIndex: fearGreedData.data[0].value,
          fearGreedValue: fearGreedData.data[0].value_classification,
          btcDominance: globalData.data.market_cap_percentage.btc.toFixed(2),
          totalMarketCap: (globalData.data.total_market_cap.usd / 1e12).toFixed(2),
          volume24h: (globalData.data.total_volume.usd / 1e9).toFixed(2),
        })

        setFearGreedHistory(fearGreedHistoryData.data.reverse())
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-up-show')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.fade-up')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [loading])

  const chartData = {
    labels: fearGreedHistory.map(item => item.timestamp),
    datasets: [
      {
        label: 'Fear & Greed Index',
        data: fearGreedHistory.map(item => item.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Fear & Greed Index History (30 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (loading) {
    return <div className="advanced-analytics">Loading...</div>
  }

  return (
    <div className={`advanced-analytics ${darkMode ? 'dark-mode' : ''}`} ref={analyticsRef}>
      <button className="mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <h3 className="fade-up">Advanced Analytics</h3>
      <div className="analytics-grid">
        <div className="analytics-item fear-greed fade-up">
          <h4>Fear & Greed Index</h4>
          <div className="index-value">{marketData.fearGreedIndex}</div>
          <div className="index-label">{marketData.fearGreedValue}</div>
        </div>
        <div className="analytics-item fade-up">
          <h4>Bitcoin Dominance</h4>
          <p>{marketData.btcDominance}%</p>
        </div>
        <div className="analytics-item fade-up">
          <h4>Total Market Cap</h4>
          <p>${marketData.totalMarketCap}T</p>
        </div>
        <div className="analytics-item fade-up">
          <h4>24h Volume</h4>
          <p>${marketData.volume24h}B</p>
        </div>
      </div>
      <div className="chart-container fade-up">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default AdvancedAnalytics

