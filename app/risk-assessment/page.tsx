"use client";

import Papa from "papaparse";
import { useState, useEffect } from "react";
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

export default function RiskAssessmentPage() {
  const { setData, data: storeData } = useRiskData();
  const [localData, setLocalData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  // Sync localData and headers from store if available
  useEffect(() => {
    if (storeData.length > 0 && localData.length === 0) {
      setLocalData(storeData);
      const keys = Object.keys(storeData[0] || {});
      setHeaders(keys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];
        const keys = Object.keys(parsed[0] || {});
        setHeaders(keys);
        setLocalData(parsed);
        setData(parsed); // Sync to dashboard
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        <label className="inline-block bg-black text-white px-6 py-3 rounded-lg cursor-pointer shadow hover:scale-105 transition w-fit">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          Upload CSV File
        </label>
      </div>

      {localData.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <div className="overflow-x-auto rounded border border-gray-300 bg-white mb-6" style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }}>
              <table className="table-auto w-full border-collapse text-sm text-left">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="p-3 border font-semibold border-gray-300 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {localData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50">
                      {headers.map((header, colIdx) => (
                        <td key={colIdx} className="p-3 border border-gray-200 align-top">
                          {row[header] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
