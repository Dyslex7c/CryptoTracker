'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import "./chart.scss"

interface ChartProps {
  coinId: string;
  coinName: string;
}

interface PriceData {
    prices: [number, number][]; // Tuple [timestamp, price]
  }
  
  interface ChartData {
    date: string;
    price: number;
  }

const Chart: React.FC<ChartProps> = ({ coinId, coinName }) => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
        const data: PriceData = await response.json()
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price,
        }))
        setChartData(formattedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching chart data:', error)
        setLoading(false)
      }
    }

    fetchChartData()
  }, [coinId])

  if (loading) return <div className="widget">Loading chart...</div>

  return (
    <div className="widget">
      <h3>{coinName} Price (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="var(--foreground)" />
          <YAxis stroke="var(--foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--foreground)',
            }}
          />
          <Line type="monotone" dataKey="price" stroke="var(--tertiary)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart

