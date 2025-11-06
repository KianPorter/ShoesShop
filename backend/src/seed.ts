import { randomBytes } from 'crypto'
import pool from './db'

// Generate a simple ID (similar to cuid)
const generateId = () => {
  const timestamp = Date.now().toString(36)
  const random = randomBytes(6).toString('hex')
  return `${timestamp}${random}`
}

async function main() {
  // Create sample products - 20 items
  const products = [
    {
      name: 'Classic White Sneakers',
      description: 'Comfortable and stylish white sneakers perfect for everyday wear. Made with premium materials for durability.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'sneakers',
      stock: 50,
      featured: true,
    },
    {
      name: 'Leather Boots',
      description: 'Durable leather boots ideal for outdoor adventures. Waterproof and comfortable for long walks.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53bd5492d948?w=500',
      category: 'boots',
      stock: 30,
      featured: true,
    },
    {
      name: 'Comfortable Sandals',
      description: 'Lightweight and breathable sandals perfect for summer. Great for beach and casual wear.',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      category: 'sandals',
      stock: 40,
      featured: true,
    },
    {
      name: 'Formal Dress Shoes',
      description: 'Elegant dress shoes for formal occasions. Crafted with premium leather and classic design.',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      category: 'dress-shoes',
      stock: 25,
      featured: false,
    },
    {
      name: 'Running Shoes',
      description: 'High-performance running shoes with advanced cushioning technology. Perfect for athletes.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
      category: 'athletic',
      stock: 60,
      featured: true,
    },
    {
      name: 'Casual Canvas Shoes',
      description: 'Versatile canvas shoes that go with any outfit. Lightweight and comfortable for daily activities.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
      category: 'casual',
      stock: 45,
      featured: false,
    },
    {
      name: 'High-Top Sneakers',
      description: 'Stylish high-top sneakers with modern design. Perfect for street style and casual occasions.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
      category: 'sneakers',
      stock: 35,
      featured: false,
    },
    {
      name: 'Winter Boots',
      description: 'Warm and waterproof winter boots. Keep your feet dry and comfortable in cold weather.',
      price: 139.99,
      imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500',
      category: 'boots',
      stock: 20,
      featured: false,
    },
    {
      name: 'Sport Sandals',
      description: 'Athletic sandals designed for active lifestyle. Comfortable for sports and outdoor activities.',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      category: 'sandals',
      stock: 30,
      featured: false,
    },
    {
      name: 'Oxford Dress Shoes',
      description: 'Classic Oxford shoes for business and formal events. Timeless design with premium quality.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
      category: 'dress-shoes',
      stock: 15,
      featured: false,
    },
    {
      name: 'Platform Sneakers',
      description: 'Trendy platform sneakers with extra height. Perfect for adding style and comfort to any outfit.',
      price: 94.99,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
      category: 'sneakers',
      stock: 28,
      featured: true,
    },
    {
      name: 'Ankle Boots',
      description: 'Chic ankle boots that pair perfectly with jeans or dresses. Versatile and fashionable.',
      price: 119.99,
      imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500',
      category: 'boots',
      stock: 32,
      featured: true,
    },
    {
      name: 'Flip Flops',
      description: 'Classic flip flops for the beach or pool. Comfortable and easy to slip on and off.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      category: 'sandals',
      stock: 75,
      featured: false,
    },
    {
      name: 'Loafers',
      description: 'Sophisticated loafers for business casual or smart casual looks. Premium leather construction.',
      price: 134.99,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      category: 'dress-shoes',
      stock: 22,
      featured: false,
    },
    {
      name: 'Basketball Shoes',
      description: 'High-top basketball shoes with excellent ankle support. Designed for performance on the court.',
      price: 124.99,
      imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
      category: 'athletic',
      stock: 18,
      featured: true,
    },
    {
      name: 'Slip-On Sneakers',
      description: 'Convenient slip-on sneakers with no laces. Perfect for quick outings and casual wear.',
      price: 64.99,
      imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500',
      category: 'casual',
      stock: 38,
      featured: false,
    },
    {
      name: 'Retro Running Shoes',
      description: 'Vintage-inspired running shoes with modern comfort technology. Style meets performance.',
      price: 109.99,
      imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
      category: 'sneakers',
      stock: 27,
      featured: false,
    },
    {
      name: 'Performance Training Shoes',
      description: 'Lightweight training shoes designed for intense workouts and cross-training. Superior stability and breathability.',
      price: 114.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'athletic',
      stock: 45,
      featured: true,
    },
    {
      name: 'Water Sandals',
      description: 'Quick-drying water sandals perfect for water activities. Comfortable and durable.',
      price: 44.99,
      imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
      category: 'sandals',
      stock: 42,
      featured: false,
    },
    {
      name: 'Monk Strap Shoes',
      description: 'Elegant monk strap shoes with buckle closure. Perfect for professional settings and formal events.',
      price: 174.99,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
      category: 'dress-shoes',
      stock: 12,
      featured: false,
    },
  ]

  // Clear existing products
  await pool.query('DELETE FROM "CartItem"')
  await pool.query('DELETE FROM "Product"')

  // Create products
  for (const product of products) {
    const productId = generateId()
    await pool.query(
      'INSERT INTO "Product" (id, name, description, price, "imageUrl", category, stock, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        productId,
        product.name,
        product.description,
        product.price,
        product.imageUrl,
        product.category,
        product.stock,
        product.featured,
      ]
    )
  }

  console.log(`✅ Successfully created ${products.length} sample products!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })

