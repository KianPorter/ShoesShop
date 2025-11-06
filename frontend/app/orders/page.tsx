'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productImage: string
  quantity: number
}

interface Order {
  id: string
  userId: string
  total: number
  status: string
  shippingName: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/orders')
      return
    }

    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your orders
            </p>
          </div>
        </AnimatedSection>

        {orders.length === 0 ? (
          <AnimatedSection animation="zoom-in">
            <div className="max-w-md mx-auto text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                <FiShoppingBag className="text-5xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">No Orders Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't placed any orders. Start shopping to see your orders here.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          </AnimatedSection>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order, index) => (
              <AnimatedSection key={order.id} animation="fade-up" delay={index * 0.1}>
                <Link href={`/orders/${order.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-xl cursor-pointer">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <FiPackage className="text-2xl text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                          <p className="font-bold dark:text-white">#{order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                        <p className="font-bold dark:text-white">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item) => (
                          <div key={item.id} className="flex-shrink-0">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                              x{item.quantity}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <p className="text-gray-600 dark:text-gray-400 font-bold">
                              +{order.items.length - 4}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

