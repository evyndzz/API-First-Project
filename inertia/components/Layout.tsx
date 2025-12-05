import React from 'react'
import { Link } from '@inertiajs/react'
import FlashMessage from './FlashMessage'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Categories', href: '/categories', icon: '📂' },
    { name: 'Products', href: '/products', icon: '📦' },
    { name: 'Transactions', href: '/transactions', icon: '📋' },
    { name: 'Suppliers', href: '/suppliers', icon: '🏢' },
    { name: 'Exchange Rate', href: '/exchange-rate', icon: '💱' },
    { name: 'Email Notification', href: '/email-notification', icon: '📧' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <FlashMessage />
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col glass animate-fade-in">
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/20">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inventaris
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 transition-all duration-200 hover:translate-x-1 group"
              >
                <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="group-hover:text-indigo-600 transition-colors">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-1 glass border-r border-white/20">
          <div className="flex h-20 items-center px-6 border-b border-white/20">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inventaris
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-white/50 transition-all duration-200 hover:translate-x-1 group"
              >
                <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="group-hover:text-indigo-600 transition-colors">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Header with Glassmorphism */}
        <div className="sticky top-0 z-40 glass border-b border-white/20">
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{title || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">Welcome, Admin</span>
              <Link
                href="/logout"
                method="post"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/30"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>

        <main className="p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
