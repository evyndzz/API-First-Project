import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import Layout from '../components/Layout'
import axios from 'axios'

interface LowStockProduct {
  id: number
  nama: string
  merk: string
  stok: number
  harga: number
}

interface Transaction {
  id: number
  tipe: 'masuk' | 'keluar'
  jumlah: number
  catatan?: string
  product?: string
  created_at: string
}

export default function EmailNotification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'lowstock' | 'transaction'>('lowstock')
  
  // Low Stock States
  const [lowStockEmail, setLowStockEmail] = useState('')
  const [lowStockThreshold, setLowStockThreshold] = useState(10)
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  
  // Transaction States
  const [transactionEmail, setTransactionEmail] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('/api/ui/email-notification/low-stock', {
        params: { threshold: lowStockThreshold }
      })

      if (response.data.success) {
        setLowStockProducts(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch low stock products')
    } finally {
      setLoading(false)
    }
  }

  const sendLowStockNotification = async () => {
    if (!lowStockEmail.trim()) {
      setError('Please enter email address')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await axios.post('/api/ui/email-notification/low-stock/send', {
        email: lowStockEmail,
        threshold: lowStockThreshold
      })

      if (response.data.success) {
        setSuccess('Low stock notification sent successfully!')
        setLowStockEmail('')
      } else {
        setError(response.data.message || 'Failed to send notification')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('/api/ui/email-notification/transactions', {
        params: { limit: 10 }
      })

      if (response.data.success) {
        setRecentTransactions(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const sendTransactionNotification = async () => {
    if (!transactionEmail.trim()) {
      setError('Please enter email address')
      return
    }
    if (!transactionId || isNaN(parseInt(transactionId))) {
      setError('Please enter a valid transaction ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await axios.post(`/api/ui/email-notification/transactions/${transactionId}/send`, {
        email: transactionEmail
      })

      if (response.data.success) {
        setSuccess('Transaction notification sent successfully!')
        setTransactionEmail('')
        setTransactionId('')
      } else {
        setError(response.data.message || 'Failed to send notification')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (activeTab === 'lowstock') {
      fetchLowStockProducts()
    } else {
      fetchRecentTransactions()
    }
  }, [activeTab, lowStockThreshold])

  return (
    <>
      <Head title="Email Notification" />
      <Layout title="Email Notification">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('lowstock')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lowstock'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Low Stock Notification
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transaction'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Transaction Notification
              </button>
            </nav>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Low Stock Tab */}
          {activeTab === 'lowstock' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Products</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                    min="1"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={fetchLowStockProducts}
                  disabled={loading}
                  className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh List'}
                </button>

                {lowStockProducts.length > 0 ? (
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lowStockProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.nama} {product.merk && `(${product.merk})`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                              {product.stok}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rp {product.harga.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">No products with low stock</p>
                )}
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Send Low Stock Notification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={lowStockEmail}
                      onChange={(e) => setLowStockEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={sendLowStockNotification}
                    disabled={loading || lowStockProducts.length === 0}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Tab */}
          {activeTab === 'transaction' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                <button
                  onClick={fetchRecentTransactions}
                  disabled={loading}
                  className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh List'}
                </button>

                {recentTransactions.length > 0 ? (
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.tipe === 'masuk' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.tipe}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.product || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.jumlah}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">No recent transactions</p>
                )}
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Send Transaction Notification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction ID"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={transactionEmail}
                      onChange={(e) => setTransactionEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={sendTransactionNotification}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Notification'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}

