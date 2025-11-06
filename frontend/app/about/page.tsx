export const metadata = {
  title: 'About Us - SportSoles',
  description: 'Learn about SportSoles, our mission, and commitment to quality footwear.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center dark:text-white">About SportSoles</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 dark:text-white">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Founded in 2015, SportSoles has been dedicated to providing customers with high-quality footwear 
              that combines style, comfort, and durability. What started as a small local store has grown into 
              a trusted online destination for shoe lovers worldwide.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our journey began with a simple mission: to make premium footwear accessible to everyone. 
              We carefully curate our collection, working directly with manufacturers to ensure the highest 
              standards of quality and craftsmanship.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 dark:text-white">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              At SportSoles, we believe that the right pair of shoes can transform your day. Our mission is to 
              help you find that perfect pair - whether you're looking for comfortable everyday sneakers, 
              stylish dress shoes, or durable boots for outdoor adventures.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We are committed to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Providing exceptional customer service</li>
              <li>Offering high-quality products at competitive prices</li>
              <li>Ensuring fast and reliable shipping</li>
              <li>Supporting sustainable and ethical manufacturing practices</li>
              <li>Constantly expanding our collection to meet your needs</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 dark:text-white">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Quality Assurance</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Every product in our collection undergoes rigorous quality checks to ensure it meets 
                  our high standards.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Wide Selection</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  From casual sneakers to formal dress shoes, we have something for every occasion and style.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Fast Shipping</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We offer fast and reliable shipping options to get your favorite shoes to you as quickly as possible.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Customer Support</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our dedicated customer service team is here to help you with any questions or concerns.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 dark:text-white">Our Values</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Integrity, quality, and customer satisfaction are at the heart of everything we do. 
              We value the trust our customers place in us and work tirelessly to exceed their expectations. 
              As we continue to grow, we remain committed to our founding principles while embracing 
              innovation and improvement.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4 dark:text-white">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Email:</strong> info@sportsoles.com
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

