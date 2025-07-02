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
      const exclude = ["Max CIA Value", "Threat Value", "Risk Value"];
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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[90vw] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData && Object.keys(initialData).length ? "Edit Risk" : "Create Risk"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {visibleFields.map((col) => (
            <div key={col} className="flex flex-col">
              <label className="text-sm font-semibold mb-1">{col}</label>

              {DROPDOWN_OPTIONS[col] ? (
                <select
                  value={formData[col] || ""}
                  onChange={(e) => handleChange(col, e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
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
                  className="border px-2 py-1 rounded text-sm"
                  value={formData[col] || ""}
                  onChange={(e) => handleChange(col, e.target.value)}
                />
              ) : (
                <input
                  type={typeof formData[col] === "number" ? "number" : "text"}
                  className="border px-2 py-1 rounded text-sm"
                  value={formData[col] || ""}
                  onChange={(e) => handleChange(col, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
