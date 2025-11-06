'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => void
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuth()

  useEffect(() => {
    if (user && token) {
      fetchCart()
    } else {
      setCart([])
    }
  }, [user, token])

  const fetchCart = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!token) {
      alert('Please sign in to add items to cart')
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCart(response.data.items || [])
    } catch (error: any) {
      console.error('Failed to add to cart:', error)
      alert(error.response?.data?.message || 'Failed to add item to cart')
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    if (!token) return

    try {
      const response = await axios.delete(
        `${API_URL}/cart/remove/${cartItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!token) return

    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    try {
      const response = await axios.put(
        `${API_URL}/cart/update/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

