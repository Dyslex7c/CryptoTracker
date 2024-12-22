import React, { useState } from 'react'
import './recent-transactions.scss'

interface Transaction {
  id: string
  date: string
  type: 'buy' | 'sell' | 'transfer'
  asset: string
  amount: number
  value: number
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2023-04-15 14:30', type: 'buy', asset: 'BTC', amount: 0.5, value: 22500 },
  { id: '2', date: '2023-04-14 10:15', type: 'sell', asset: 'ETH', amount: 2, value: 6000 },
  { id: '3', date: '2023-04-13 18:45', type: 'transfer', asset: 'ADA', amount: 1000, value: 1200 },
  { id: '4', date: '2023-04-12 09:00', type: 'buy', asset: 'DOT', amount: 50, value: 1000 },
  { id: '5', date: '2023-04-11 16:20', type: 'sell', asset: 'SOL', amount: 10, value: 1500 },
]

const RecentTransactions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`recent-transactions ${isOpen ? 'open' : ''}`}>
      <h2 onClick={() => setIsOpen(!isOpen)}>Recent Transactions</h2>
      <div className="recent-transactions__content">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td className={`transaction-type ${transaction.type}`}>{transaction.type}</td>
                <td>{transaction.asset}</td>
                <td>{transaction.amount}</td>
                <td>${transaction.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentTransactions

