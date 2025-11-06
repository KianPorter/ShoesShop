'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCreative, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
  id: string
  name: string
  imageUrl: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function HeroCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?featured=true&limit=5`)
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Fallback images if API fails
      setProducts([
        { id: '1', name: 'Classic Sneakers', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920' },
        { id: '2', name: 'Leather Boots', imageUrl: 'https://images.unsplash.com/photo-1608256246200-53bd5492d948?w=1920' },
        { id: '3', name: 'Running Shoes', imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
      </div>
    )
  }

  // If no products, use gradient fallback
  if (products.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Swiper
        modules={[Autoplay, EffectCreative, Pagination, Navigation]}
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            opacity: 0,
          },
          next: {
            translate: ['100%', 0, 0],
            opacity: 0,
          },
        }}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-full modern-hero-swiper"
        style={{ width: '100%', height: '100%' }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id} className="relative w-full h-full">
            <div className="relative w-full h-full group">
              {/* Ken Burns Effect - Slow Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920'}
                  alt={product.name}
                  fill
                  className="object-cover scale-100 group-hover:scale-110 transition-transform duration-[10000ms] ease-out animate-ken-burns"
                  priority={index === 0}
                  quality={90}
                  unoptimized
                />
              </div>
              
              {/* Modern Multi-Layer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/40 to-pink-600/40 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Animated Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptLTEyIDBjMy4zMSAwIDYtMi42OSA2LTZzLTIuNjktNi02LTYtNiAyLjY5LTYgNiAyLjY5IDYgNiA2em0wIDEyYzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMTIgMGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse-slow"></div>
              </div>
              
              {/* Vignette Effect */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .animate-ken-burns {
          animation: ken-burns 10s ease-out infinite alternate;
        }

        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Modern Swiper Pagination */
        .modern-hero-swiper .swiper-pagination {
          bottom: 40px !important;
        }

        .modern-hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .modern-hero-swiper .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
        }

        /* Modern Navigation Arrows */
        .modern-hero-swiper .swiper-button-next,
        .modern-hero-swiper .swiper-button-prev {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .modern-hero-swiper .swiper-button-next:hover,
        .modern-hero-swiper .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.1);
        }

        .modern-hero-swiper .swiper-button-next::after,
        .modern-hero-swiper .swiper-button-prev::after {
          font-size: 20px;
          color: white;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .modern-hero-swiper .swiper-button-next,
          .modern-hero-swiper .swiper-button-prev {
            width: 40px;
            height: 40px;
          }

          .modern-hero-swiper .swiper-button-next::after,
          .modern-hero-swiper .swiper-button-prev::after {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}

