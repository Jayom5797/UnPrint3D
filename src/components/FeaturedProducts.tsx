
import plaImage from '../assets/pla.png'
import gidImage from '../assets/gid.png'
import absImage from '../assets/abs.png'

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      title: "PLA+ Filament (1kg)",
      price: "₹699",
      description: "High-quality PLA+ for smooth, reliable printing.",
      image: plaImage
    },
    {
      id: 2,
      title: "GLow In Dark Filament (1kg)",
      price: "₹1,499",
      description: "Durable and temperature-resistant PETG.",
      image: gidImage
    },
    {
      id: 3,
      title: "ABS Filament (1kg)",
      price: "₹749",
      description: "Strong and sturdy ABS for functional parts.",
      image: absImage
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Premium Filaments
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            High-quality 3D printing filaments for all your creative projects
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.price}
                  </span>
                  <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
            View All Filaments
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
