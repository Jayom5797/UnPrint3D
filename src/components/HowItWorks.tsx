import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload Your Model",
      description: "Upload your 3D model in STL, OBJ, or other supported formats. Our platform will analyze it for printability.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Choose Material",
      description: "Select from a wide range of high-quality filaments like PLA, PETG, ABS, and more to suit your project needs.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Print & Ship",
      description: "Our advanced 3D printers will bring your design to life with precision. We'll ship the final product to your door.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H6.545C5.43 17 4.6 16.112 4.5 15.002L3 6h18l-1.5 9.002c-.1.112-.83.998-1.945.998H13z" />
        </svg>
      )
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bringing your ideas to life is simple and straightforward
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center relative">
              {/* Step Number */}
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full transform -translate-y-1/2 w-8">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to bring your ideas to life?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Get an instant quote for your 3D model or browse our premium filament selection.
          </p>
          <button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Upload a Model
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
