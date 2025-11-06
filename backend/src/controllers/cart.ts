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

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!

    // Check if cart exists
    let cartResult = await pool.query(
      'SELECT id FROM "Cart" WHERE "userId" = $1',
      [userId]
    )

    let cartId: string

    if (cartResult.rows.length === 0) {
      // Create cart if it doesn't exist
      cartId = generateId()
      await pool.query(
        'INSERT INTO "Cart" (id, "userId") VALUES ($1, $2)',
        [cartId, userId]
      )
    } else {
      cartId = cartResult.rows[0].id
    }

    // Get cart items with product details
    const itemsResult = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci."cartId",
        ci."productId",
        ci."createdAt",
        ci."updatedAt",
        p.id as "product_id",
        p.name as "product_name",
        p.description as "product_description",
        p.price as "product_price",
        p."imageUrl" as "product_imageUrl",
        p.category as "product_category",
        p.stock as "product_stock",
        p.featured as "product_featured",
        p."createdAt" as "product_createdAt",
        p."updatedAt" as "product_updatedAt"
      FROM "CartItem" ci
      INNER JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."cartId" = $1`,
      [cartId]
    )

    // Transform results to match expected structure
    const items = itemsResult.rows.map(row => ({
      id: row.id,
      quantity: row.quantity,
      cartId: row.cartId,
      productId: row.productId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        price: parseFloat(row.product_price),
        imageUrl: row.product_imageUrl,
        category: row.product_category,
        stock: row.product_stock,
        featured: row.product_featured,
        createdAt: row.product_createdAt,
        updatedAt: row.product_updatedAt,
      },
    }))

    res.json({ items })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Verify product exists
    const productResult = await pool.query(
      'SELECT id FROM "Product" WHERE id = $1',
      [productId]
    )

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM "Cart" WHERE "userId" = $1',
      [userId]
    )

    let cartId: string

    if (cartResult.rows.length === 0) {
      cartId = generateId()
      await pool.query(
        'INSERT INTO "Cart" (id, "userId") VALUES ($1, $2)',
        [cartId, userId]
      )
    } else {
      cartId = cartResult.rows[0].id
    }

    // Check if item already in cart
    const existingItemResult = await pool.query(
      'SELECT id, quantity FROM "CartItem" WHERE "cartId" = $1 AND "productId" = $2',
      [cartId, productId]
    )

    if (existingItemResult.rows.length > 0) {
      // Update quantity
      const existingItem = existingItemResult.rows[0]
      await pool.query(
        'UPDATE "CartItem" SET quantity = $1 WHERE id = $2',
        [existingItem.quantity + quantity, existingItem.id]
      )
    } else {
      // Add new item
      const itemId = generateId()
      await pool.query(
        'INSERT INTO "CartItem" (id, "cartId", "productId", quantity) VALUES ($1, $2, $3, $4)',
        [itemId, cartId, productId, quantity]
      )
    }

    // Return updated cart
    const itemsResult = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci."cartId",
        ci."productId",
        ci."createdAt",
        ci."updatedAt",
        p.id as "product_id",
        p.name as "product_name",
        p.description as "product_description",
        p.price as "product_price",
        p."imageUrl" as "product_imageUrl",
        p.category as "product_category",
        p.stock as "product_stock",
        p.featured as "product_featured",
        p."createdAt" as "product_createdAt",
        p."updatedAt" as "product_updatedAt"
      FROM "CartItem" ci
      INNER JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."cartId" = $1`,
      [cartId]
    )

    // Transform results
    const items = itemsResult.rows.map(row => ({
      id: row.id,
      quantity: row.quantity,
      cartId: row.cartId,
      productId: row.productId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        price: parseFloat(row.product_price),
        imageUrl: row.product_imageUrl,
        category: row.product_category,
        stock: row.product_stock,
        featured: row.product_featured,
        createdAt: row.product_createdAt,
        updatedAt: row.product_updatedAt,
      },
    }))

    res.json({ items })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { itemId } = req.params

    // Verify cart exists and get cart ID
    const cartResult = await pool.query(
      'SELECT id FROM "Cart" WHERE "userId" = $1',
      [userId]
    )

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const cartId = cartResult.rows[0].id

    // Delete the cart item
    await pool.query(
      'DELETE FROM "CartItem" WHERE id = $1',
      [itemId]
    )

    // Return updated cart
    const itemsResult = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci."cartId",
        ci."productId",
        ci."createdAt",
        ci."updatedAt",
        p.id as "product_id",
        p.name as "product_name",
        p.description as "product_description",
        p.price as "product_price",
        p."imageUrl" as "product_imageUrl",
        p.category as "product_category",
        p.stock as "product_stock",
        p.featured as "product_featured",
        p."createdAt" as "product_createdAt",
        p."updatedAt" as "product_updatedAt"
      FROM "CartItem" ci
      INNER JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."cartId" = $1`,
      [cartId]
    )

    // Transform results
    const items = itemsResult.rows.map(row => ({
      id: row.id,
      quantity: row.quantity,
      cartId: row.cartId,
      productId: row.productId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        price: parseFloat(row.product_price),
        imageUrl: row.product_imageUrl,
        category: row.product_category,
        stock: row.product_stock,
        featured: row.product_featured,
        createdAt: row.product_createdAt,
        updatedAt: row.product_updatedAt,
      },
    }))

    res.json({ items })
  } catch (error) {
    console.error('Error removing from cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity <= 0) {
      return removeFromCart(req, res)
    }

    // Verify cart exists and get cart ID
    const cartResult = await pool.query(
      'SELECT id FROM "Cart" WHERE "userId" = $1',
      [userId]
    )

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const cartId = cartResult.rows[0].id

    // Update cart item quantity
    await pool.query(
      'UPDATE "CartItem" SET quantity = $1 WHERE id = $2',
      [quantity, itemId]
    )

    // Return updated cart
    const itemsResult = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci."cartId",
        ci."productId",
        ci."createdAt",
        ci."updatedAt",
        p.id as "product_id",
        p.name as "product_name",
        p.description as "product_description",
        p.price as "product_price",
        p."imageUrl" as "product_imageUrl",
        p.category as "product_category",
        p.stock as "product_stock",
        p.featured as "product_featured",
        p."createdAt" as "product_createdAt",
        p."updatedAt" as "product_updatedAt"
      FROM "CartItem" ci
      INNER JOIN "Product" p ON ci."productId" = p.id
      WHERE ci."cartId" = $1`,
      [cartId]
    )

    // Transform results
    const items = itemsResult.rows.map(row => ({
      id: row.id,
      quantity: row.quantity,
      cartId: row.cartId,
      productId: row.productId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      product: {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        price: parseFloat(row.product_price),
        imageUrl: row.product_imageUrl,
        category: row.product_category,
        stock: row.product_stock,
        featured: row.product_featured,
        createdAt: row.product_createdAt,
        updatedAt: row.product_updatedAt,
      },
    }))

    res.json({ items })
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

