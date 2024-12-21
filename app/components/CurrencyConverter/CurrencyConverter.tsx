'use client'

import { useState, useEffect } from 'react'
import { ArrowUpDownIcon as ArrowsUpDown } from 'lucide-react'
import "./currency-converter.scss"

// define types for currencies and exchange rates
type Currency = 'BTC' | 'ETH' | 'USD' | 'EUR' | 'GBP' | 'JPY'

interface ExchangeRate {
  [key: string]: Record<Currency, number>
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState<Currency>('BTC')
  const [toCurrency, setToCurrency] = useState<Currency>('USD')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const currencies: Currency[] = ['BTC', 'ETH', 'USD', 'EUR', 'GBP', 'JPY']

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur,gbp,jpy`)
        const data = await response.json()
        const rates: ExchangeRate = {
          BTC: {
            USD: data.bitcoin.usd, EUR: data.bitcoin.eur, GBP: data.bitcoin.gbp, JPY: data.bitcoin.jpy,
            BTC: 0,
            ETH: 0
          },
          ETH: {
            USD: data.ethereum.usd, EUR: data.ethereum.eur, GBP: data.ethereum.gbp, JPY: data.ethereum.jpy,
            BTC: 0,
            ETH: 0
          },
        }
        setExchangeRate(rates)
      } catch (error) {
        console.error('Error fetching exchange rate:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRate()
  }, [])

  useEffect(() => {
    if (exchangeRate) {
      const rate =
        fromCurrency === toCurrency
          ? 1
          : exchangeRate[fromCurrency]?.[toCurrency] ||
            1 / exchangeRate[toCurrency]?.[fromCurrency]
      setConvertedAmount((amount * rate).toFixed(2))
    }
  }, [amount, fromCurrency, toCurrency, exchangeRate])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="currency-converter">
      <h3>Currency Converter</h3>
      <div className="converter-form">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value as Currency)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <button className="swap-button" onClick={handleSwap}>
          <ArrowsUpDown size={16} />
          Swap
        </button>
        <div className="input-group">
          <input
            type="number"
            value={convertedAmount || ''}
            readOnly
          />
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value as Currency)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <p className="result">Loading...</p>
      ) : convertedAmount && (
        <div className="result">
          <p>
            {amount} {fromCurrency} = <span className="converted-amount">{convertedAmount} {toCurrency}</span>
          </p>
        </div>
      )}
      {exchangeRate && (
        <p className="exchange-rate">
          1 {fromCurrency} = {exchangeRate[fromCurrency]?.[toCurrency] || (1 / exchangeRate[toCurrency]?.[fromCurrency]).toFixed(6)} {toCurrency}
        </p>
      )}
    </div>
  )
}

export default CurrencyConverter
