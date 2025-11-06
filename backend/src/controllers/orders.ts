import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { randomBytes } from 'crypto'
import pool from '../db'

// Generate a simple ID (similar to cuid)
const generateId = () => {
  const timestamp = Date.now().toString(36)
  const random = randomBytes(6).toString('hex')
  return `${timestamp}${random}`
}

// Create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const { shippingInfo, paymentMethod } = req.body

    // Validate shipping info
    if (!shippingInfo || !shippingInfo.name || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip || !shippingInfo.country || !shippingInfo.phone) {
      return res.status(400).json({ error: 'All shipping information is required' })
    }

    // Get user's cart
    const cartResult = await pool.query(
      'SELECT id FROM "Cart" WHERE "userId" = $1',
      [userId]
    )

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const cartId = cartResult.rows[0].id

    // Get cart items with product details
    const cartItemsResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p."imageUrl", p.stock
       FROM "CartItem" ci
       JOIN "Product" p ON ci."productId" = p.id
       WHERE ci."cartId" = $1`,
      [cartId]
    )

    if (cartItemsResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const cartItems = cartItemsResult.rows

    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.name}. Available: ${item.stock}, Requested: ${item.quantity}` 
        })
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create order
    const orderId = generateId()
    await pool.query(
      `INSERT INTO "Order" (id, "userId", total, status, "shippingName", "shippingEmail", "shippingAddress", "shippingCity", "shippingState", "shippingZip", "shippingCountry", "shippingPhone", "paymentMethod")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        orderId,
        userId,
        total,
        'pending',
        shippingInfo.name,
        shippingInfo.email,
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.state,
        shippingInfo.zip,
        shippingInfo.country,
        shippingInfo.phone,
        paymentMethod || 'card'
      ]
    )

    // Create order items and update product stock
    for (const item of cartItems) {
      const orderItemId = generateId()
      await pool.query(
        `INSERT INTO "OrderItem" (id, "orderId", "productId", "productName", "productPrice", "productImage", quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderItemId, orderId, item.productId, item.name, item.price, item.imageUrl, item.quantity]
      )

      // Update product stock
      await pool.query(
        'UPDATE "Product" SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      )
    }

    // Clear cart
    await pool.query('DELETE FROM "CartItem" WHERE "cartId" = $1', [cartId])

    // Fetch the created order with items
    const orderResult = await pool.query(
      `SELECT o.*, 
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi."productId",
            'productName', oi."productName",
            'productPrice', oi."productPrice",
            'productImage', oi."productImage",
            'quantity', oi.quantity
          )
        ) as items
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       WHERE o.id = $1
       GROUP BY o.id`,
      [orderId]
    )

    res.status(201).json(orderResult.rows[0])
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

// Get all orders for a user
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    const ordersResult = await pool.query(
      `SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi."productId",
            'productName', oi."productName",
            'productPrice', oi."productPrice",
            'productImage', oi."productImage",
            'quantity', oi.quantity
          )
        ) as items
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       WHERE o."userId" = $1
       GROUP BY o.id
       ORDER BY o."createdAt" DESC`,
      [userId]
    )

    res.json(ordersResult.rows)
  } catch (error) {
    console.error('Get user orders error:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

// Get a single order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    const { id } = req.params

    const orderResult = await pool.query(
      `SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi."productId",
            'productName', oi."productName",
            'productPrice', oi."productPrice",
            'productImage', oi."productImage",
            'quantity', oi.quantity
          )
        ) as items
       FROM "Order" o
       LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
       WHERE o.id = $1 AND o."userId" = $2
       GROUP BY o.id`,
      [id, userId]
    )

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(orderResult.rows[0])
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

