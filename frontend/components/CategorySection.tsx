'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const categories = [
  { name: 'Sneakers', slug: 'sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
  { name: 'Boots', slug: 'boots', image: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=400&h=400&fit=crop' },
  { name: 'Sandals', slug: 'sandals', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop' },
  { name: 'Dress Shoes', slug: 'dress-shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
  { name: 'Athletic', slug: 'athletic', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop' },
  { name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop' },
]

export default function CategorySection() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 dark:text-white">Shop by Category</h2>
        <p className="text-gray-600 dark:text-gray-400">Find your perfect style</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/shop?category=${category.slug}`}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center group border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-105 overflow-hidden opacity-0 animate-zoom-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="relative h-32 w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-bold text-white text-shadow-lg group-hover:text-blue-300 transition-colors">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

