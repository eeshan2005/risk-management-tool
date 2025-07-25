export default function Page() {
  return (
    <div className="space-y-12 fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <span className="text-4xl">📘</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Risk Assessment Guidelines</h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Comprehensive guidelines for evaluating and managing organizational risks effectively
        </p>
      </div>

      {/* Threat Frequency */}
      <section className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Threat Frequency</h2>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400">Very High</div>
              <div className="text-slate-600 dark:text-slate-400">Occurs frequently (multiple times a month)</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <div className="font-semibold text-orange-700 dark:text-orange-400">High</div>
              <div className="text-slate-600 dark:text-slate-400">Might occur occasionally (multiple times a year)</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <div className="font-semibold text-yellow-700 dark:text-yellow-400">Medium</div>
              <div className="text-slate-600 dark:text-slate-400">Could occur sometime (once a year)</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400">Low</div>
              <div className="text-slate-600 dark:text-slate-400">Rare; may occur once every 2–5 years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Impact */}
      <section className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <span className="text-2xl">💥</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Threat Impact</h2>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400">Very High</div>
              <div className="text-slate-600 dark:text-slate-400">Project viability threatened; legal or contractual risk</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <div className="font-semibold text-orange-700 dark:text-orange-400">High</div>
              <div className="text-slate-600 dark:text-slate-400">Major delays or rework; client dissatisfaction likely</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <div className="font-semibold text-yellow-700 dark:text-yellow-400">Medium</div>
              <div className="text-slate-600 dark:text-slate-400">Minor delays; client informed but trust remains</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400">Low</div>
              <div className="text-slate-600 dark:text-slate-400">No impact on timeline or experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CIA Ratings */}
      <section className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Confidentiality, Integrity & Availability (CIA) Ratings</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-3">4</div>
            <div className="font-semibold text-red-700 dark:text-red-400">Very High</div>
          </div>
          <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-3">3</div>
            <div className="font-semibold text-orange-700 dark:text-orange-400">High</div>
          </div>
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-3">2</div>
            <div className="font-semibold text-yellow-700 dark:text-yellow-400">Medium</div>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-3">1</div>
            <div className="font-semibold text-green-700 dark:text-green-400">Low</div>
          </div>
        </div>
      </section>

      {/* Vulnerability Rating */}
      <section className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="text-2xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vulnerability Rating</h2>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400">Critical</div>
              <div className="text-slate-600 dark:text-slate-400">No controls or serious lapses; easily exploitable</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <div className="font-semibold text-orange-700 dark:text-orange-400">High</div>
              <div className="text-slate-600 dark:text-slate-400">Weak/outdated controls; plausible exploitation</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <div className="font-semibold text-yellow-700 dark:text-yellow-400">Medium</div>
              <div className="text-slate-600 dark:text-slate-400">Minor gaps in controls; some risk of exploitation</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400">Low</div>
              <div className="text-slate-600 dark:text-slate-400">Effective controls; exploitation unlikely</div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Evaluation */}
      <section className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Risk Evaluation and Acceptance Criteria</h2>
        </div>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="bg-green-500 text-white rounded-lg px-3 py-2 font-bold text-sm">1-16</div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400 text-lg">Negligible</div>
              <div className="text-slate-600 dark:text-slate-400">Acceptable. No action required.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="bg-blue-500 text-white rounded-lg px-3 py-2 font-bold text-sm">17-64</div>
            <div>
              <div className="font-semibold text-blue-700 dark:text-blue-400 text-lg">Low</div>
              <div className="text-slate-600 dark:text-slate-400">Monitor. Document and observe.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <div className="bg-yellow-500 text-white rounded-lg px-3 py-2 font-bold text-sm">65-128</div>
            <div>
              <div className="font-semibold text-yellow-700 dark:text-yellow-400 text-lg">Medium</div>
              <div className="text-slate-600 dark:text-slate-400">Treat. Implement controls and monitor.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
            <div className="bg-orange-500 text-white rounded-lg px-3 py-2 font-bold text-sm">129-192</div>
            <div>
              <div className="font-semibold text-orange-700 dark:text-orange-400 text-lg">High</div>
              <div className="text-slate-600 dark:text-slate-400">Act. Mitigate immediately with senior oversight.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <div className="bg-red-500 text-white rounded-lg px-3 py-2 font-bold text-sm">193-256</div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400 text-lg">Very High</div>
              <div className="text-slate-600 dark:text-slate-400">Critical. Unacceptable — escalate urgently.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}