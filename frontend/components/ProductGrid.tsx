'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { FiShoppingCart } from 'react-icons/fi'

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
  description: string
  category: string
}

interface ProductGridProps {
  featured?: boolean
  category?: string
  limit?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ProductGrid({ featured, category, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [featured, category])

  const fetchProducts = async () => {
    try {
      let url = `${API_URL}/products?`
      if (featured) url += 'featured=true&'
      if (category) url += `category=${category}&`
      if (limit) url += `limit=${limit}&`
      
      const response = await axios.get(url)
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(productId, 1)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-96 animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 opacity-0 animate-fade-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
              <Image
                src={product.imageUrl || '/placeholder-shoe.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
              <div className="mb-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{product.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{product.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
                  title="Add to cart"
                >
                  <FiShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

