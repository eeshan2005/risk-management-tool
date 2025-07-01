"use client";

import { useRiskData } from "@/store/useRiskData";
import PieChartCard from "@/components/PieChartCard";

const severityColors: Record<string, string> = {
  "Negligible": "#60D394",  // soft green
  "Low": "#FFD93D",         // bright yellow
  "Medium": "#FFB347",      // orange
  "High": "#FF6B6B",        // red
  "Very High": "#9D4EDD",   // purple
};

const treatmentColors: Record<string, string> = {
  "Accept": "#60D394",
  "Avoid": "#FF885E",
  "Monitor": "#4D96FF",
  "Transfer": "#FFD93D",
  "Treat": "#FF6B6B",
};

// Risk level mapping based on value
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

  // Count risk levels from data
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

  // Calculate metrics for cards
  const totalRisks = data.length;
  const mostCommonTreatment = Object.entries(treatmentCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Risk Management Dashboard</h1>
      {/* Cards Row */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 min-w-[180px] border border-gray-200">
          <div className="text-sm text-gray-500">Total Risks</div>
          <div className="text-2xl font-bold">{totalRisks}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[180px] border border-gray-200">
          <div className="text-sm text-gray-500">Most Common Risk Level</div>
          <div className="text-2xl font-bold">{mostCommonRiskLevel}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 min-w-[180px] border border-gray-200">
          <div className="text-sm text-gray-500">Most Common Treatment</div>
          <div className="text-2xl font-bold">{mostCommonTreatment}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <PieChartCard title="Risk Level Distribution" data={riskLevelData} />
        <PieChartCard title="Risk Treatment Options" data={treatmentData} />
      </div>
    </div>
  );
}
