"use client";
import { useState, useEffect } from "react";
import { useRiskData } from "@/store/useRiskData";

interface RiskFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const DROPDOWN_OPTIONS: Record<string, string[]> = {
  "Risk Owner": [
    "Admin",
    "Process Owners",
    "CISO",
    "Procurement",
    "HR",
    "IT",
    "Project Manager",
  ],
  Confidentiality: ["1", "2", "3", "4"],
  Integrity: ["1", "2", "3", "4"],
  Availability: ["1", "2", "3", "4"],
  "Vulnerability Rating": ["1", "2", "3", "4"],
  "Threat Frequency": ["1", "2", "3", "4"],
  "Threat Impact": ["1", "2", "3", "4"],
  "Risk Treatment Option": [
    "Accept",
    "Mitigate",
    "Monitor",
    "Terminate",
    "Transfer",
  ],
};

export default function RiskFormModal({
  onClose,
  onSave,
  initialData = {},
}: RiskFormModalProps) {
  const { data } = useRiskData();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    // Initialize form only once when data is available and not already initialized
    if (data.length > 0 && Object.keys(formData).length === 0) {
      const exclude = ["Max CIA Value", "Threat Value", "Risk Value","Sr#"];
      const allCols = Object.keys(data[0]).filter((col) => !exclude.includes(col));
      setColumns(allCols);

      const initState: Record<string, any> = {};
      allCols.forEach((col) => {
        initState[col] = initialData[col] ?? "";
      });
      setFormData(initState);
    }
  }, [data]);

  const getNum = (value: any) => Number(value || 0);
  const threatImpact = getNum(formData["Threat Impact"]);
  const threatFrequency = getNum(formData["Threat Frequency"]);
  const confidentiality = getNum(formData["Confidentiality"]);
  const integrity = getNum(formData["Integrity"]);
  const availability = getNum(formData["Availability"]);
  const vulnerabilityValue = getNum(formData["Vulnerability Rating"]);

  const maxCIA = Math.max(confidentiality, integrity, availability);
  const threatValue = threatImpact * threatFrequency;
  const riskValue = maxCIA * threatValue * vulnerabilityValue;

  const handleChange = (key: string, value: string) => {
    const stayString = DROPDOWN_OPTIONS[key] || key.toLowerCase().includes("date");
    setFormData((prev) => ({
      ...prev,
      [key]: stayString ? value : isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSubmit = () => {
    const cleanedForm: Record<string, string | number> = {};
    Object.entries(formData).forEach(([k, v]) => {
      cleanedForm[k] = v === "" || v === undefined ? "-" : v;
    });

    onSave({
      ...cleanedForm,
      "Max CIA Value": maxCIA,
      "Threat Value": threatValue,
      "Risk Value": riskValue,
    });

    onClose();
  };

  if (columns.length === 0) return null;

  const triggerField = "Planned Mitigation Completion Date";
  const alwaysShowField = "Risk Treatment Option";

  const triggerIdx = columns.indexOf(triggerField);
  const alwaysShowIdx = columns.indexOf(alwaysShowField);
  const showAllFields = formData[triggerField]?.toString().trim() !== "";

  let visibleFields: string[] = [];

  if (columns.length > 0) {
    if (showAllFields) {
      visibleFields = [...columns];
    } else {
      visibleFields = columns.slice(0, triggerIdx + 1);
    }

    if (alwaysShowIdx !== -1 && !visibleFields.includes(alwaysShowField)) {
      visibleFields.push(alwaysShowField);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700 fade-in">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialData && Object.keys(initialData).length ? "Edit Risk Assessment" : "Create New Risk Assessment"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {initialData && Object.keys(initialData).length ? "Update the risk details below" : "Fill in the details to create a new risk assessment"}
          </p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleFields.map((col) => (
              <div key={col} className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {col}
                  {col === "Risk Owner" && <span className="text-red-500 ml-1">*</span>}
                </label>

                {DROPDOWN_OPTIONS[col] ? (
                  <select
                    value={formData[col] || ""}
                    onChange={(e) => handleChange(col, e.target.value)}
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select {col}
                    </option>
                    {DROPDOWN_OPTIONS[col].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : col.toLowerCase().includes("date") ? (
                  <input
                    type="date"
                    className="form-input"
                    value={formData[col] || ""}
                    onChange={(e) => handleChange(col, e.target.value)}
                  />
                ) : (
                  <input
                    type={typeof formData[col] === "number" ? "number" : "text"}
                    className="form-input"
                    value={formData[col] || ""}
                    onChange={(e) => handleChange(col, e.target.value)}
                    placeholder={`Enter ${col.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Calculated Values Display */}
          {(maxCIA > 0 || threatValue > 0 || riskValue > 0) && (
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Calculated Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{maxCIA}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Max CIA Value</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{threatValue}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Threat Value</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{riskValue}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Risk Value</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            {initialData && Object.keys(initialData).length ? "Update Risk" : "Create Risk"}
          </button>
        </div>
      </div>
    </div>
  );
}
