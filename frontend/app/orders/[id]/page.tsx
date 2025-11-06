'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import { FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi'

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
  shippingEmail: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  shippingPhone: string
  paymentMethod: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchOrder()
  }, [user, params.id])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order:', error)
      alert('Order not found')
      router.push('/orders')
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

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <AnimatedSection animation="zoom-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <FiCheckCircle className="text-5xl text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Thank you for your purchase
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Order #{order.id}
            </p>
          </div>
        </AnimatedSection>

        {/* Order Status */}
        <AnimatedSection animation="fade-up" delay={0.1}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <FiPackage className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-bold text-lg dark:text-white capitalize">{order.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiTruck className="text-2xl text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                  <p className="font-bold text-lg dark:text-white">3-5 Business Days</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Order Items */}
        <AnimatedSection animation="fade-up" delay={0.2}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold dark:text-white">{item.productName}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ${item.productPrice.toFixed(2)} each
                    </p>
                  </div>
                  <p className="font-bold text-lg dark:text-white">
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-6">
              <div className="flex justify-between text-2xl font-bold dark:text-white">
                <span>Total</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Shipping & Payment Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AnimatedSection animation="fade-right" delay={0.3}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <FiMapPin className="text-2xl text-blue-600" />
                <h2 className="text-xl font-bold dark:text-white">Shipping Address</h2>
              </div>
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-bold dark:text-white">{order.shippingName}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                <p>{order.shippingCountry}</p>
                <p className="mt-2">{order.shippingPhone}</p>
                <p>{order.shippingEmail}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={0.3}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <FiCreditCard className="text-2xl text-purple-600" />
                <h2 className="text-xl font-bold dark:text-white">Payment Method</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Order Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Actions */}
        <AnimatedSection animation="fade-up" delay={0.4}>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/orders"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Orders
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

