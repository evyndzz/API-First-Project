import React from 'react'
import { Head } from '@inertiajs/react'
import Layout from '../components/Layout'

interface DashboardProps {
  stats: {
    totalProducts: number
    totalCategories: number
    todayTransactions: number
    lowStockItems: number
    recentTransactions: Array<{
      id: number
      tipe: string
      jumlah: number
      created_at: string
      product: {
        nama: string
      }
    }>
    productsByCategory: Array<{
      id: number
      nama: string
      products: Array<{
        id: number
        nama: string
        stok: number
      }>
    }>
  }
}

export default function Dashboard({ stats }: DashboardProps) {
  const safeStats = stats || {
    totalProducts: 0,
    totalCategories: 0,
    todayTransactions: 0,
    lowStockItems: 0,
    recentTransactions: [],
    productsByCategory: []
  }

  const statsData = [
    { name: 'Total Products', value: String(safeStats.totalProducts || 0), icon: '📦' },
    { name: 'Categories', value: String(safeStats.totalCategories || 0), icon: '📂' },
    { name: 'Transactions Today', value: String(safeStats.todayTransactions || 0), icon: '📋' },
    { name: 'Low Stock Items', value: String(safeStats.lowStockItems || 0), icon: '⚠️' },
  ]

  const gradientClasses = [
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-blue-500 to-cyan-600',
    'bg-gradient-to-br from-orange-500 to-amber-600',
  ]

  return (
    <>
      <Head title="Dashboard" />
      <Layout title="Dashboard">
        <div className="space-y-8 animate-fade-in">
          {/* Stats Cards with Glassmorphism */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <div 
                key={stat.name} 
                className="glass card-hover rounded-2xl overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.name}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-xl ${gradientClasses[index]} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions Card */}
          <div className="glass card-hover rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Transactions
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {safeStats.recentTransactions.length > 0 ? (
                      safeStats.recentTransactions.map((transaction, idx) => (
                        <tr 
                          key={transaction.id} 
                          className="hover:bg-indigo-50/50 transition-colors duration-200"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {transaction.product?.nama || 'Unknown Product'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                              transaction.tipe === 'masuk' 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                                : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
                            }`}>
                              {transaction.tipe}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.jumlah}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('id-ID') : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No recent transactions
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Products Overview Card */}
          <div className="glass card-hover rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Products Overview
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"></div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-50 to-rose-50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {safeStats.productsByCategory && safeStats.productsByCategory.length > 0 ? (
                        safeStats.productsByCategory.flatMap(category => 
                          category.products?.map((product: any, idx: number) => (
                            <tr 
                              key={product.id}
                              className="hover:bg-pink-50/50 transition-colors duration-200"
                              style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                {product.nama}
                                {product.merk && <span className="text-gray-500 ml-1 font-normal">({product.merk})</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {category.nama}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                                  product.stok < 10 
                                    ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' 
                                    : product.stok < 20
                                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                    : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                }`}>
                                  {product.stok}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rp {Number(product.harga).toLocaleString('id-ID')}
                              </td>
                            </tr>
                          )) || []
                        )
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass card-hover rounded-2xl overflow-hidden group cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Add Product</h3>
                    <p className="text-sm text-gray-600 mt-1">Add a new product to inventory</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass card-hover rounded-2xl overflow-hidden group cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">New Transaction</h3>
                    <p className="text-sm text-gray-600 mt-1">Record stock in/out transaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass card-hover rounded-2xl overflow-hidden group cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">View Reports</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate inventory reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
