import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import Layout from '../components/Layout'
import axios from 'axios'

interface Product {
  id: number
  nama: string
  merk: string
  harga: number
}

// Currency to country mapping
const currencyCountries: Record<string, string> = {
  // Major Currencies
  'USD': 'United States',
  'EUR': 'European Union',
  'GBP': 'United Kingdom',
  'JPY': 'Japan',
  'CNY': 'China',
  'AUD': 'Australia',
  'CAD': 'Canada',
  'CHF': 'Switzerland',
  'NZD': 'New Zealand',
  
  // Asian Currencies
  'IDR': 'Indonesia',
  'SGD': 'Singapore',
  'MYR': 'Malaysia',
  'THB': 'Thailand',
  'HKD': 'Hong Kong',
  'KRW': 'South Korea',
  'INR': 'India',
  'PHP': 'Philippines',
  'VND': 'Vietnam',
  'TWD': 'Taiwan',
  'PKR': 'Pakistan',
  'BDT': 'Bangladesh',
  'LKR': 'Sri Lanka',
  'NPR': 'Nepal',
  'MMK': 'Myanmar',
  'KHR': 'Cambodia',
  'LAK': 'Laos',
  'BND': 'Brunei',
  
  // Middle East
  'AED': 'United Arab Emirates',
  'SAR': 'Saudi Arabia',
  'ILS': 'Israel',
  'JOD': 'Jordan',
  'KWD': 'Kuwait',
  'BHD': 'Bahrain',
  'QAR': 'Qatar',
  'OMR': 'Oman',
  'IRR': 'Iran',
  'IQD': 'Iraq',
  'LBP': 'Lebanon',
  'TRY': 'Turkey',
  
  // Americas
  'BRL': 'Brazil',
  'MXN': 'Mexico',
  'ARS': 'Argentina',
  'CLP': 'Chile',
  'COP': 'Colombia',
  'PEN': 'Peru',
  'UYU': 'Uruguay',
  'VES': 'Venezuela',
  'BOB': 'Bolivia',
  'PYG': 'Paraguay',
  'GTQ': 'Guatemala',
  'CRC': 'Costa Rica',
  'PAB': 'Panama',
  'DOP': 'Dominican Republic',
  'JMD': 'Jamaica',
  'TTD': 'Trinidad and Tobago',
  
  // Europe
  'RUB': 'Russia',
  'PLN': 'Poland',
  'CZK': 'Czech Republic',
  'HUF': 'Hungary',
  'RON': 'Romania',
  'BGN': 'Bulgaria',
  'HRK': 'Croatia',
  'SEK': 'Sweden',
  'NOK': 'Norway',
  'DKK': 'Denmark',
  'ISK': 'Iceland',
  'UAH': 'Ukraine',
  'BYN': 'Belarus',
  'RSD': 'Serbia',
  'BAM': 'Bosnia and Herzegovina',
  'MKD': 'North Macedonia',
  'ALL': 'Albania',
  'MDL': 'Moldova',
  'GEL': 'Georgia',
  'AMD': 'Armenia',
  'AZN': 'Azerbaijan',
  
  // Africa
  'ZAR': 'South Africa',
  'EGP': 'Egypt',
  'NGN': 'Nigeria',
  'KES': 'Kenya',
  'UGX': 'Uganda',
  'TZS': 'Tanzania',
  'ETB': 'Ethiopia',
  'GHS': 'Ghana',
  'XOF': 'West African CFA',
  'XAF': 'Central African CFA',
  'MAD': 'Morocco',
  'TND': 'Tunisia',
  'DZD': 'Algeria',
  'LYD': 'Libya',
  'MZN': 'Mozambique',
  'AOA': 'Angola',
  'ZMW': 'Zambia',
  'BWP': 'Botswana',
  'MWK': 'Malawi',
  'MUR': 'Mauritius',
  
  // Oceania
  'FJD': 'Fiji',
  'PGK': 'Papua New Guinea',
  'SBD': 'Solomon Islands',
  'VUV': 'Vanuatu',
  'WST': 'Samoa',
  'TOP': 'Tonga',
  'XPF': 'French Polynesia',
  
  // Other
  'MOP': 'Macau',
  'KZT': 'Kazakhstan',
  'UZS': 'Uzbekistan',
  'KGS': 'Kyrgyzstan',
  'TJS': 'Tajikistan',
  'TMT': 'Turkmenistan',
  'MNT': 'Mongolia',
  'AFN': 'Afghanistan'
}

// Format number based on currency
const formatCurrency = (value: number, currency: string): string => {
  if (currency === 'IDR') {
    // Format Indonesia: 1.000.000,00
    return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'NZD'].includes(currency)) {
    // Format US/Europe: 1,000,000.00
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (currency === 'JPY') {
    // JPY usually has no decimals
    return value.toLocaleString('ja-JP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  } else {
    // Default format
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
}

// Format exchange rate (always use dot for decimal)
const formatExchangeRate = (value: number): string => {
  return value.toFixed(4).replace(/,/g, '.')
}

export default function ExchangeRate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fromCurrency, setFromCurrency] = useState('IDR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState('')
  const [exchangeResult, setExchangeResult] = useState<any>(null)
  const [currencies, setCurrencies] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('')
  const [productConvertResult, setProductConvertResult] = useState<any>(null)

  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('/api/ui/exchange-rate/currencies')

      if (response.data.success) {
        setCurrencies(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch currencies')
    } finally {
      setLoading(false)
    }
  }

  const getExchangeRate = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get('/api/ui/exchange-rate', {
        params: {
          from: fromCurrency,
          to: toCurrency
        }
      })

      if (response.data.success) {
        setExchangeResult(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get exchange rate')
    } finally {
      setLoading(false)
    }
  }

  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axios.get('/api/ui/exchange-rate/convert', {
        params: {
          amount: parseFloat(amount),
          from: fromCurrency,
          to: toCurrency
        }
      })

      if (response.data.success) {
        setExchangeResult(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to convert currency')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('/api/ui/exchange-rate/products')

      if (response.data.success) {
        setProducts(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const convertProductPrice = async () => {
    if (!selectedProduct || isNaN(parseInt(selectedProduct.toString()))) {
      setError('Please select a product')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axios.get('/api/ui/exchange-rate/products/convert', {
        params: {
          productId: selectedProduct,
          to: toCurrency
        }
      })

      if (response.data.success) {
        setProductConvertResult(response.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to convert product price')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (currencies.length === 0) {
      fetchCurrencies()
    }
    if (products.length === 0) {
      fetchProducts()
    }
  }, [])

  return (
    <>
      <Head title="Exchange Rate" />
      <Layout title="Exchange Rate">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Get Exchange Rate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Currency
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} {currencyCountries[curr] ? `(${currencyCountries[curr]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Currency
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} {currencyCountries[curr] ? `(${currencyCountries[curr]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={getExchangeRate}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Get Rate'}
                </button>
              </div>
            </div>

            {exchangeResult && !exchangeResult.convertedAmount && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Rate:</strong> 1 {exchangeResult.from} = {formatExchangeRate(exchangeResult.rate)} {exchangeResult.to}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Convert Currency</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} {currencyCountries[curr] ? `(${currencyCountries[curr]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={convertCurrency}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Converting...' : 'Convert'}
                </button>
              </div>
            </div>

            {exchangeResult && exchangeResult.convertedAmount && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-md">
                <p className="text-lg font-semibold text-indigo-900">
                  {formatCurrency(parseFloat(amount), exchangeResult.from)} {exchangeResult.from} = {formatCurrency(exchangeResult.convertedAmount, exchangeResult.to)} {exchangeResult.to}
                </p>
                <p className="text-sm text-indigo-700 mt-1">
                  Exchange Rate: {formatExchangeRate(exchangeResult.rate)}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Convert Product Price</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nama} {product.merk && `(${product.merk})`} - Rp {product.harga.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Currency
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} {currencyCountries[curr] ? `(${currencyCountries[curr]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={convertProductPrice}
                  disabled={loading || !selectedProduct}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Converting...' : 'Convert Price'}
                </button>
              </div>
            </div>

            {productConvertResult && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  {productConvertResult.product_name}
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <strong>Original Price:</strong> Rp {productConvertResult.original_price.toLocaleString('id-ID')} (IDR)
                  </p>
                  <p className="text-green-800 font-semibold">
                    <strong>Converted Price:</strong> {formatCurrency(productConvertResult.converted_price, productConvertResult.target_currency)} {productConvertResult.target_currency}
                  </p>
                  <p className="text-gray-600">
                    <strong>Exchange Rate:</strong> {formatExchangeRate(productConvertResult.exchange_rate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

