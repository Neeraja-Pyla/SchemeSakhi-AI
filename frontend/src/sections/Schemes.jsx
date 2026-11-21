
function Schemes() {
  const schemes = [
    {
      name: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      description: 'Financial support for eligible farmer families.',
      icon: '🌾',
      color: 'bg-green-100',
    },
    {
      name: 'National Scholarship Portal',
      category: 'Education',
      description: 'Explore scholarships for eligible students.',
      icon: '🎓',
      color: 'bg-blue-100',
    },
    {
      name: 'Ayushman Bharat PM-JAY',
      category: 'Healthcare',
      description: 'Health coverage for eligible families.',
      icon: '🏥',
      color: 'bg-red-100',
    },
  ]

  return (
    <section id="schemes" className="bg-white py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-green-700 font-semibold text-sm">
            DISCOVER BENEFITS
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Explore Government Schemes
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Find government schemes that match your needs and understand
            their benefits in simple language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {schemes.map((scheme) => (
            <div
              key={scheme.name}
              className="border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition"
            >
              <div className={`w-14 h-14 ${scheme.color} rounded-xl flex items-center justify-center text-2xl`}>
                {scheme.icon}
              </div>

              <p className="text-green-700 text-sm font-semibold mt-6">
                {scheme.category}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-2">
                {scheme.name}
              </h3>

              <p className="text-gray-500 mt-3 leading-relaxed">
                {scheme.description}
              </p>

              <button className="mt-6 text-green-700 font-semibold hover:text-green-900">
                Learn More →
              </button>
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default Schemes
