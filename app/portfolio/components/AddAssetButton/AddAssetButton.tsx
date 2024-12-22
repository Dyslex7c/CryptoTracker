import React from 'react'
import './add-asset-button.scss'

const AddAssetButton: React.FC = () => {
  return (
    <button className="add-asset-button">
      <span className="add-asset-button__icon">+</span>
      <span className="add-asset-button__text">Add Asset</span>
    </button>
  )
}

export default AddAssetButton

