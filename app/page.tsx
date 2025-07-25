export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/file.svg')] opacity-20"></div>
      
      <section className="text-center p-8 max-w-4xl mx-auto relative z-10 fade-in">
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="p-4 bg-blue-600/20 rounded-2xl backdrop-blur-sm border border-blue-500/30">
            <span className="text-5xl">🛡️</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            AssureGate
          </h1>
        </div>

        <h2 className="text-3xl mb-6 font-semibold tracking-wide text-blue-100">
          Risk Management Tool
        </h2>

        <p className="mb-12 text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
          Comprehensive risk assessment and management platform designed to protect your organization through intelligent monitoring, analysis, and mitigation strategies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href="/login"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span>Login</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">🔐</span>
          </a>
          <a
            href="/signup"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
          >
            <span>Sign Up</span>
            <span className="text-xl">📝</span>
          </a>
          <a
            href="/guidelines"
            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
          >
            <span>View Guidelines</span>
            <span className="text-xl">📘</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-gray-300 text-sm">Monitor and analyze risks with comprehensive dashboards</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Advanced Assessment</h3>
            <p className="text-gray-300 text-sm">Detailed risk evaluation with customizable parameters</p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-300 text-sm">Streamlined workflows for efficient risk management</p>
          </div>
        </div>
      </section>
    </main>
  )
}