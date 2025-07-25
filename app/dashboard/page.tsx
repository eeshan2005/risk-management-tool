"use client";

import { useEffect, useState } from "react";
import { useRiskData } from "@/store/useRiskData";
import PieChartCard from "@/components/PieChartCard";

const severityColors: Record<string, string> = {
  "Negligible": "#60D394",
  "Low": "#FFD93D",
  "Medium": "#FFB347",
  "High": "#FF6B6B",
  "Very High": "#9D4EDD",
};

const treatmentColors: Record<string, string> = {
  "Accept": "#60D394",
  "Avoid": "#FF885E",
  "Monitor": "#4D96FF",
  "Transfer": "#FFD93D",
  "Treat": "#FF6B6B",
};

function getRiskLevel(value: number) {
  if (value >= 1 && value <= 16) return "Negligible";
  if (value >= 17 && value <= 64) return "Low";
  if (value >= 65 && value <= 128) return "Medium";
  if (value >= 129 && value <= 192) return "High";
  if (value >= 193 && value <= 256) return "Very High";
  return "Unknown";
}

export default function DashboardPage() {
  const { data } = useRiskData();

  // ✅ Fix for hydration issues
  const [hasMounted, setHasMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setHasMounted(true);
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  if (!hasMounted) return null; // ✅ Prevents hydration mismatch

  const riskLevelCount: Record<string, number> = {};
  data.forEach((row) => {
    const riskValue = Number(row["Risk Value"] || row["RiskValue"] || row["risk_value"]);
    const level = getRiskLevel(riskValue);
    if (level && level !== "Unknown") riskLevelCount[level] = (riskLevelCount[level] || 0) + 1;
  });

  const riskLevelData = Object.entries(riskLevelCount).map(([name, value]) => ({
    name,
    value,
    color: severityColors[name] || "#8884d8",
  }));

  const mostCommonRiskLevel = Object.entries(riskLevelCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const treatmentCount: Record<string, number> = {};
  data.forEach((row) => {
    const treatment = row["Risk Treatment Option"]?.trim();
    if (treatment) treatmentCount[treatment] = (treatmentCount[treatment] || 0) + 1;
  });

  const treatmentData = Object.entries(treatmentCount).map(([name, value]) => ({
    name,
    value,
    color: treatmentColors[name] || "#8884d8",
  }));

  const totalRisks = data.length;
  const mostCommonTreatment = Object.entries(treatmentCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Risk Management Dashboard</h1>
          <p className="text-slate-600">Monitor and analyze your organization's risk landscape</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Last updated</div>
          <div className="text-lg font-semibold text-slate-700">{currentDate}</div>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{totalRisks}</div>
              <div className="text-sm text-slate-500">Total Risks</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">↗ Active monitoring</div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{mostCommonRiskLevel}</div>
              <div className="text-sm text-slate-500">Most Common Level</div>
            </div>
          </div>
          <div className="text-sm text-orange-600 font-medium">Primary risk category</div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🛠️</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{mostCommonTreatment}</div>
              <div className="text-sm text-slate-500">Common Treatment</div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">Preferred strategy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PieChartCard title="Risk Level Distribution" data={riskLevelData} />
        <PieChartCard title="Risk Treatment Options" data={treatmentData} />
      </div>
    </div>
  );
}
