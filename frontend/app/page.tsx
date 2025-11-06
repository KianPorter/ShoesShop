import FeaturedCarousel from '@/components/FeaturedCarousel'
import ProductGrid from '@/components/ProductGrid'
import CategorySection from '@/components/CategorySection'
import HeroCarousel from '@/components/HeroCarousel'
import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Carousel Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <HeroCarousel />
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <AnimatedSection animation="zoom-in" duration={1}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl">
              Step Into Style
            </h1>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={0.2} duration={1}>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
              Discover premium footwear that combines comfort, quality, and unmatched style
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={0.4} duration={1}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl hover:shadow-3xl"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all"
              >
                Learn More
              </Link>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10"></div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <AnimatedSection animation="slide-up" duration={1}>
          <FeaturedCarousel />
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={0.1}>
          <CategorySection />
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={0.1}>
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold dark:text-white mb-2">Latest Products</h2>
                <p className="text-gray-600 dark:text-gray-400">Handpicked selection of our newest arrivals</p>
              </div>
              <Link
                href="/shop"
                className="hidden md:block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
              >
                View All
              </Link>
            </div>
            <ProductGrid featured={false} limit={8} />
          </section>
        </AnimatedSection>
      </div>
    </div>
  )
}

