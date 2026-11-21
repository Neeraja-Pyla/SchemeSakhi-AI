
function Hero() {
  return (
    <section className="bg-[#F8FAF7] min-h-[550px] flex items-center justify-center px-6 py-20">

      <div className="max-w-4xl mx-auto text-center">

        {/* Small Label */}
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          Your Personal Government Scheme Assistant
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Government Schemes,
          <span className="text-green-700"> Made Simple.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover government schemes, understand your eligibility,
          and get personalized guidance — all in a language you understand.
        </p>

        {/* Search Box */}
        <div className="mt-10 max-w-2xl mx-auto bg-white p-3 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Ask about scholarships, pensions, farming..."
            className="flex-1 px-4 py-3 outline-none text-gray-700"
          />

          <button className="bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold transition">
            Ask AI →
          </button>

        </div>

        {/* Language Options */}
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
          <span>Available in:</span>
          <span className="font-semibold text-green-700">English</span>
          <span>•</span>
          <span className="font-semibold text-green-700">తెలుగు</span>
        </div>

        {/* Trust Message */}
        <p className="mt-8 text-sm text-gray-400">
          ✓ Guidance based on government information and published scheme sources
        </p>

      </div>

    </section>
  )
}

export default Hero
