'use client'

import { Home, PieChart, Star, Book, Settings, X, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import './sidebar.scss'

type SidebarProps = {
  isOpen: boolean
  closeSidebar: () => void
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('/')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { href: '/portfolio', label: 'Portfolio', icon: <PieChart size={20} /> },
    { href: '/watchlist', label: 'Watchlist', icon: <Star size={20} /> },
    { href: '/learn', label: 'Learn', icon: <Book size={20} /> },
    { href: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <>
      <button className="sidebar-toggle-btn" onClick={closeSidebar}>
        <Menu size={24} />
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h1>CryptoTracker</h1>
          </div>
          {isMobile && (
            <button onClick={closeSidebar} className="close-btn">
              <X size={24} />
            </button>
          )}
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`menu-item ${activeItem === item.href ? 'active' : ''}`}
                  onClick={() => {
                    setActiveItem(item.href)
                    if (isMobile) closeSidebar()
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>&copy; 2024 CryptoTracker</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

