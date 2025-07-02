export default function Page() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-black mb-6">📘 Risk Assessment Guidelines</h1>

      {/* Threat Frequency */}
      <section>
        <h2 className="text-xl font-semibold text-black mb-2">⚠ Threat Frequency</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>4 - Very High:</strong> Occurs frequently (multiple times a month).</li>
          <li><strong>3 - High:</strong> Might occur occasionally (multiple times a year).</li>
          <li><strong>2 - Medium:</strong> Could occur sometime (once a year).</li>
          <li><strong>1 - Low:</strong> Rare; may occur once every 2–5 years.</li>
        </ul>
      </section>

      {/* Threat Impact */}
      <section>
        <h2 className="text-xl font-semibold text-black mb-2">💥 Threat Impact</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>4 - Very High:</strong> Project viability threatened; legal or contractual risk.</li>
          <li><strong>3 - High:</strong> Major delays or rework; client dissatisfaction likely.</li>
          <li><strong>2 - Medium:</strong> Minor delays; client informed but trust remains.</li>
          <li><strong>1 - Low:</strong> No impact on timeline or experience.</li>
        </ul>
      </section>

      {/* CIA Ratings */}
      <section>
        <h2 className="text-xl font-semibold text-black mb-2">🔒 Confidentiality, Integrity & Availability (CIA) Ratings</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>4 - Very High</strong></li>
          <li><strong>3 - High</strong></li>
          <li><strong>2 - Medium</strong></li>
          <li><strong>1 - Low</strong></li>
        </ul>
      </section>

      {/* Vulnerability Rating */}
      <section>
        <h2 className="text-xl font-semibold text-black mb-2">🛡 Vulnerability Rating</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>4:</strong> No controls or serious lapses; easily exploitable.</li>
          <li><strong>3:</strong> Weak/outdated controls; plausible exploitation.</li>
          <li><strong>2:</strong> Minor gaps in controls; some risk of exploitation.</li>
          <li><strong>1:</strong> Effective controls; exploitation unlikely.</li>
        </ul>
      </section>

      {/* Risk Evaluation */}
      <section>
        <h2 className="text-xl font-semibold text-black mb-2">📊 Risk Evaluation and Acceptance Criteria</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>1–16 (Negligible):</strong> Acceptable. No action required.</li>
          <li><strong>17–64 (Low):</strong> Monitor. Document and observe.</li>
          <li><strong>65–128 (Medium):</strong> Treat. Implement controls and monitor.</li>
          <li><strong>129–192 (High):</strong> Act. Mitigate immediately with senior oversight.</li>
          <li><strong>193–256 (Very High):</strong> Critical. Unacceptable — escalate urgently.</li>
        </ul>
      </section>
    </div>
  );
}