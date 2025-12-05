import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'
import SuccessToast from '../../components/SuccessToast'

interface Product {
  id: number
  nama: string
  merk: string
  stok: number
  harga: number
  kategori_id?: number
  category: {
    id: number
    nama: string
  }
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  nama: string
}

interface Props {
  products: {
    data: Product[]
    meta: any
  }
  categories: Category[]
  flash?: {
    success?: string
    error?: string
  }
}

export default function ProductsIndex({ products, categories, flash }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const { data, setData, post, put, processing, errors, reset } = useForm({
    nama: '',
    merk: '',
    stok: 0,
    harga: 0,
    kategori_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProduct) {
      put(`/api/products/${editingProduct.id}`, {
        onSuccess: () => {
          setShowModal(false)
          setEditingProduct(null)
          reset()
          setSuccessMessage('Produk berhasil diperbarui!')
          setShowSuccessToast(true)
          router.reload({ only: ['products'] })
        },
        onError: () => {
          // keep modal open and show errors handled by useForm
        }
      })
    } else {
      post('/api/products', {
        onSuccess: () => {
          setShowModal(false)
          reset()
          setSuccessMessage('Produk berhasil ditambahkan!')
          setShowSuccessToast(true)
          router.reload({ only: ['products'] })
        },
        onError: () => {
          // errors handled by useForm
        }
      })
    }
  }

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(`/api/products/${productId}`, {
        onSuccess: () => {
          setSuccessMessage('Produk berhasil dihapus!')
          setShowSuccessToast(true)
          router.reload({ only: ['products'] })
        },
        onError: () => {
          setSuccessMessage('Gagal menghapus produk.')
          setShowSuccessToast(true)
        }
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    reset()
    setData({
      nama: product.nama,
      merk: product.merk || '',
      stok: product.stok,
      harga: product.harga,
      kategori_id: (product.kategori_id ?? product.category?.id ?? '').toString(),
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    reset()
  }

  const filteredProducts = products.data.filter(product =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.merk?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Head title="Products" />
      <Layout title="Products">
        <SuccessToast
          message={successMessage}
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Products</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your inventory products</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              + Add Product
            </button>
          </div>

          <div className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full glass border-0 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id} 
                className="glass card-hover rounded-2xl p-6 animate-scale-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.nama}</h3>
                    {product.merk && (
                      <p className="text-sm text-gray-600 mb-2">{product.merk}</p>
                    )}
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                      {product.category.nama}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Stock:</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                      product.stok < 10 
                        ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' 
                        : product.stok < 20
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                        : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    }`}>
                      {product.stok}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Price:</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Rp {Number(product.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 glass rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new product.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    + Add Product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={handleCloseModal} />
              
              <div className="inline-block align-bottom glass rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scale-in">
                <form onSubmit={handleSubmit}>
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-white/20"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          id="nama"
                          className="mt-1 block w-full glass border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                          value={data.nama}
                          onChange={(e) => setData('nama', e.target.value)}
                        />
                        {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                      </div>

                      <div>
                        <label htmlFor="merk" className="block text-sm font-medium text-gray-700">
                          Brand
                        </label>
                        <input
                          type="text"
                          id="merk"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.merk}
                          onChange={(e) => setData('merk', e.target.value)}
                        />
                        {errors.merk && <p className="text-red-500 text-sm mt-1">{errors.merk}</p>}
                      </div>

                      <div>
                        <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">
                          Category *
                        </label>
                        <select
                          id="kategori_id"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={data.kategori_id}
                          onChange={(e) => setData('kategori_id', e.target.value)}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.nama}
                            </option>
                          ))}
                        </select>
                        {errors.kategori_id && <p className="text-red-500 text-sm mt-1">{errors.kategori_id}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="stok" className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <input
                            type="number"
                            id="stok"
                            min="0"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={data.stok}
                            onChange={(e) => setData('stok', parseInt(e.target.value) || 0)}
                          />
                          {errors.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
                        </div>

                        <div>
                          <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                            Price (Rp) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">Rp</span>
                            </div>
                            <input
                              type="text"
                              id="harga"
                              placeholder="Contoh: 1.500.000"
                              className="mt-1 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={data.harga ? Number(data.harga).toLocaleString('id-ID') : ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\./g, '')
                                setData('harga', parseInt(value) || 0)
                              }}
                            />
                          </div>
                          {errors.harga && <p className="text-red-500 text-sm mt-1">{errors.harga}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                    >
                      {processing ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/30 shadow-sm px-6 py-3 glass text-base font-semibold text-gray-700 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Global flash handled by `FlashMessage` in Layout */}
      </Layout>
    </>
  )
}
