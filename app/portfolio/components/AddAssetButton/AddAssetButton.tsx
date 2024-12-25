import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ExternalProvider } from "@ethersproject/providers";
import Contract from "../../../../contracts/artifacts/PortfolioManager_metadata.json";
import { Coin, UserAsset } from '../../page';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import './add-asset-button.scss';

const contractAddress = "0x42099C07116c6F5ff671d28F4c348ECc7F882Be4";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

interface AddAssetButtonProps {
  onAddAsset: (asset: UserAsset) => void;
  coins: Coin[];
}

const AddAssetButton: React.FC<AddAssetButtonProps> = ({ onAddAsset, coins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState(coins);

  useEffect(() => {
    setFilteredCoins(
      coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, coins]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsset && amount) {
      try {
        // Interact with smart contract
        if (!window.ethereum) throw new Error('No wallet found');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Contract.abi, signer);

        // Call the addAsset function
        const tx = await contract.addAsset(selectedAsset, ethers.utils.parseEther(amount));
        await tx.wait();

        onAddAsset({ id: selectedAsset, amount: parseFloat(amount) });
        setIsModalOpen(false);
        setSelectedAsset('');
        setAmount('');
        setSearchTerm('');
        alert('Asset added successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to add asset. Please try again.');
      }
    }
  };

  const selectedCoin = coins.find((coin) => coin.id === selectedAsset);

  return (
    <>
      <button className="add-asset-button" onClick={() => setIsModalOpen(true)}>
        <span className="add-asset-button__icon">+</span>
        <span className="add-asset-button__text">Add Asset</span>
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <button className="modal__close" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            <h2>Add Asset to Your Portfolio</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="asset-search">Search for an asset</label>
                <input
                  id="asset-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or symbol"
                />
              </div>
              <div className="form-group">
                <label htmlFor="asset-select">Select an asset</label>
                <select
                  id="asset-select"
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  required
                >
                  <option value="">Choose an asset</option>
                  {filteredCoins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              {selectedCoin && (
                <div className="selected-asset-info">
                  <img src={selectedCoin.image} alt={selectedCoin.name} />
                  <div>
                    <h3>{selectedCoin.name}</h3>
                    <p className="price">
                      <DollarSign size={16} />
                      {selectedCoin.current_price.toLocaleString()}
                    </p>
                    <p className={`change ${selectedCoin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                      <TrendingUp size={16} />
                      {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="amount-input">Amount</label>
                <input
                  id="amount-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="any"
                />
              </div>
              {selectedCoin && amount && (
                <div className="total-value">
                  <p>Total Value:</p>
                  <p>${(selectedCoin.current_price * parseFloat(amount)).toLocaleString()}</p>
                </div>
              )}
              <div className="modal__actions">
                <button type="submit" className="btn btn-primary">Add to Portfolio</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAssetButton;
