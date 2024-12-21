"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true}
      >
        <NextTopLoader
          color="var(--gradient-1)"
          height={1}
          showSpinner={false}
          zIndex={999999}
        />
        <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
          <div className="content-wrapper">
            <main className="main-content">
              {isMobile && (
                <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                  Menu
                </button>
              )}
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
