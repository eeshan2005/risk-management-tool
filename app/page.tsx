export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(at_25%_25%,theme(colors.gray.900),black_75%)] text-white">
      <section className="text-center p-6 max-w-xl mx-auto">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-4xl">🛡️</span>
          <h1 className="text-5xl font-extrabold tracking-tight">AssureGate</h1>
        </div>

        <h2 className="text-2xl mb-4 font-semibold tracking-wide">
          Risk Management Tool
        </h2>

        <p className="mb-8 text-lg text-gray-300 font-medium">
          Comprehensive risk assessment and management platform designed to protect your organization through intelligent monitoring, analysis, and mitigation strategies.
        </p>

        <a
          href="/dashboard"
          className="inline-block bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-xl text-lg font-semibold transition-all"
        >
          Get Started 📊
        </a>
      </section>
    </main>
  );
}
