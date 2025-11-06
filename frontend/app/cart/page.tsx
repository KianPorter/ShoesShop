'use client'

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, loading } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Sign In Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your cart.
          </p>
          <Link
            href="/auth"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">Loading cart...</div>
      </div>
    )
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-4 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <Link href={`/products/${item.product.id}`}>
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.product.imageUrl || '/placeholder-shoe.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </Link>

              <div className="flex-grow">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  ${item.product.price.toFixed(2)}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Remove item"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold dark:text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold dark:text-white">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 mb-4 shadow-lg hover:shadow-xl font-bold text-lg text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="block text-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

