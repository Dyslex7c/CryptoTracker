import React, { useState } from 'react'
import { Search } from 'lucide-react'
import "./search-bar.scss"

interface SearchBarProps {
  onSearch: (term: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  return (
    <div className="search-bar">
      <div className="search-bar__wrapper">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search cryptocurrencies"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search className="search-bar__icon" size={20} />
      </div>
    </div>
  )
}

export default SearchBar
