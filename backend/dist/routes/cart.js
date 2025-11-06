"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const cart_1 = require("../controllers/cart");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', cart_1.getCart);
router.post('/add', cart_1.addToCart);
router.delete('/remove/:itemId', cart_1.removeFromCart);
router.put('/update/:itemId', cart_1.updateCartItem);
exports.default = router;
