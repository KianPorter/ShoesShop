import { Router } from 'express'
import { createOrder, getUserOrders, getOrderById } from '../controllers/orders'
import { authenticate } from '../middleware/auth'

const router = Router()

// All order routes require authentication
router.post('/', authenticate, createOrder)
router.get('/', authenticate, getUserOrders)
router.get('/:id', authenticate, getOrderById)

export default router

