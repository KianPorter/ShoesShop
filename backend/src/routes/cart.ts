import express from 'express'
import { authenticate } from '../middleware/auth'
import { getCart, addToCart, removeFromCart, updateCartItem } from '../controllers/cart'

const router = express.Router()

router.use(authenticate)

router.get('/', getCart)
router.post('/add', addToCart)
router.delete('/remove/:itemId', removeFromCart)
router.put('/update/:itemId', updateCartItem)

export default router

