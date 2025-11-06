"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../controllers/orders");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All order routes require authentication
router.post('/', auth_1.authenticate, orders_1.createOrder);
router.get('/', auth_1.authenticate, orders_1.getUserOrders);
router.get('/:id', auth_1.authenticate, orders_1.getOrderById);
exports.default = router;
