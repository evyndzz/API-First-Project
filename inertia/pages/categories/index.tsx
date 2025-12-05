import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'
import SuccessToast from '../../components/SuccessToast'

interface Category {
  id: number
  nama: string
  created_at: string
  updated_at: string
}

interface Props {
  categories: {
    data: Category[]
    meta: any
  }
  flash?: {
    success?: string
    error?: string
  }
}

export default function CategoriesIndex({ categories, flash }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const { data, setData, post, put, processing, errors, reset } = useForm({
    nama: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting category form', { editingCategory, data })
    
    if (editingCategory) {
      put(`/api/categories/${editingCategory.id}`, {
        onSuccess: () => {
          console.log('Category updated successfully')
          setShowModal(false)
          setEditingCategory(null)
          reset()
          setSuccessMessage('Kategori berhasil diperbarui!')
          setShowSuccessToast(true)
          router.reload({ only: ['categories'] })
        },
        onError: (err) => {
          console.error('Failed to update category', err)
        }
      })
    } else {
      post('/api/categories', {
        onSuccess: () => {
          console.log('Category created successfully')
          setShowModal(false)
          reset()
          setSuccessMessage('Kategori berhasil ditambahkan!')
          setShowSuccessToast(true)
          router.reload({ only: ['categories'] })
        },
        onError: (err) => {
          console.error('Failed to create category', err)
        }
      })
    }
  }

  const handleDelete = (categoryId: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      router.delete(`/api/categories/${categoryId}`, {
        onSuccess: () => {
          router.reload({ only: ['categories'] })
        },
        onError: () => {
          // errors handled by server/useForm
        }
      })
    }
  }

  const handleEdit = (category: Category) => {
    console.log('Edit clicked', category)
    setEditingCategory(category)
    setData({
      nama: category.nama,
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    reset()
  }

  React.useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessToast])

  return (
    <>
      <Head title="Categories" />
      <Layout title="Categories">
        <SuccessToast
          message={successMessage}
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
              <p className="text-sm text-gray-600 mt-1">Organize your products by category</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              + Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.data.map((category, idx) => (
              <div 
                key={category.id} 
                className="glass card-hover rounded-2xl p-6 animate-scale-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📂</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{category.nama}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.data.length === 0 && (
            <div className="text-center py-16 glass rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-600">Get started by creating a new category.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  + Add Category
                </button>
              </div>
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
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                    <div>
                      <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Name
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
                  </div>
                  <div className="px-6 py-4 sm:flex sm:flex-row-reverse border-t border-white/20">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-semibold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                    >
                      {processing ? (editingCategory ? 'Updating...' : 'Adding...') : (editingCategory ? 'Update Category' : 'Add Category')}
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
