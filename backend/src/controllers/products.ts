import { Request, Response } from 'express'
import pool from '../db'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { featured, category, limit } = req.query

    let query = 'SELECT * FROM "Product" WHERE 1=1'
    const params: any[] = []
    let paramCount = 0

    if (featured === 'true') {
      paramCount++
      query += ` AND featured = $${paramCount}`
      params.push(true)
    }

    if (category) {
      paramCount++
      query += ` AND category = $${paramCount}`
      params.push(category)
    }

    query += ' ORDER BY "createdAt" DESC'

    if (limit) {
      paramCount++
      query += ` LIMIT $${paramCount}`
      params.push(parseInt(limit as string))
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM "Product" WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

