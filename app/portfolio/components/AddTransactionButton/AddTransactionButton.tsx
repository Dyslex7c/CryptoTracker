import React, { useState } from 'react'
import { Coin, Transaction } from '../../page'
import './add-transaction-button.scss'

interface AddTransactionButtonProps {
  onAddTransaction: (transaction: Transaction) => void;
  coins: Coin[];
}

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ onAddTransaction, coins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'buy' | 'sell' | 'transfer'>('buy');
  const [asset, setAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type && asset && amount && value) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type,
        asset,
        amount: parseFloat(amount),
        value: parseFloat(value),
      };
      onAddTransaction(newTransaction);
      setIsModalOpen(false);
      setType('buy');
      setAsset('');
      setAmount('');
      setValue('');
    }
  };

  return (
    <>
      <button className="add-transaction-button" onClick={() => setIsModalOpen(true)}>
        <span className="add-transaction-button__icon">+</span>
        <span className="add-transaction-button__text">Add Transaction</span>
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'buy' | 'sell' | 'transfer')}
                required
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
                <option value="transfer">Transfer</option>
              </select>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                required
              >
                <option value="">Select an asset</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
                min="0"
                step="any"
              />
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value (USD)"
                required
                min="0"
                step="any"
              />
              <div className="modal__actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AddTransactionButton

