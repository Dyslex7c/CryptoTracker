import React, { useState } from 'react'
import { Transaction } from '../../page'
import './recent-transactions.scss'

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
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
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleString()}</td>
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

