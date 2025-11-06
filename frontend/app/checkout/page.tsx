'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import Image from 'next/image'
import AnimatedSection from '@/components/AnimatedSection'
import { FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ShippingInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const { cart, loading: cartLoading } = useCart()
  const { user, token } = useAuth()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
    }
    if (cart && cart.length === 0) {
      router.push('/cart')
    }
  }, [user, cart, router])

  const validateForm = () => {
    const newErrors: Partial<ShippingInfo> = {}
    
    if (!shippingInfo.name.trim()) newErrors.name = 'Name is required'
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required'
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required'
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required'
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required'
    if (!shippingInfo.zip.trim()) newErrors.zip = 'ZIP code is required'
    if (!shippingInfo.country.trim()) newErrors.country = 'Country is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof ShippingInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setProcessing(true)

    try {
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          shippingInfo,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Redirect to order confirmation page
      router.push(`/orders/${response.data.id}`)
    } catch (error: any) {
      console.error('Order creation error:', error)
      alert(error.response?.data?.error || 'Failed to create order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (!user || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!cart || cart.length === 0) {
    return null
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 10.00
  const tax = total * 0.08
  const grandTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-down">
          <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Complete your order
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="fade-right">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <FiTruck className="text-2xl text-blue-600" />
                    <h2 className="text-2xl font-bold dark:text-white">Shipping Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingInfo.zip}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.zip ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      />
                      {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      >
                        <option value="USA">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <FiCreditCard className="text-2xl text-blue-600" />
                    <h2 className="text-2xl font-bold dark:text-white">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <FiCreditCard className="text-xl" />
                      <span className="font-medium dark:text-white">Credit/Debit Card</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <FiTruck className="text-xl" />
                      <span className="font-medium dark:text-white">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-xl" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fade-left">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white text-sm">{item.product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-xl font-bold dark:text-white">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}

