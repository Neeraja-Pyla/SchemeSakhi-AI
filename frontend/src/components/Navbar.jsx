
function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Website Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              SchemeSakhi
            </h1>

            <p className="text-xs text-gray-500">
              Your Scheme Guide
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="text-green-700">Home</a>
          <a href="#schemes" className="hover:text-green-700">Explore Schemes</a>
          <a href="#how-it-works" className="hover:text-green-700">How It Works</a>
          <a href="#about" className="hover:text-green-700">About</a>
        </div>

        {/* Get Started Button */}
        <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
          Get Started
        </button>

      </div>
    </nav>
  )
}

export default Navbar
