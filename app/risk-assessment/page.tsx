"use client";

import Papa from "papaparse";
import { useState, useEffect } from "react";
import { useRiskData } from "@/store/useRiskData";
import Search from '@/app/ui/search';
import RiskFormModal from '@/app/ui/RiskFormModal';

const REQUIRED_HEADERS = [
  "Sr#", "Business Process", "Date Risk Identified", "Risk Description", "Threats", "Vulnerabilities", "Existing Controls", "Risk Owner", "Controls / Clause No",
  "ISO 27001: 2022 Controls Reference", "Confidentiality", "Integrity", "Availability", "Max CIA Value", "Vulnerability Rating", "Threat Frequency",
  "Threat Impact", "Threat Value", "Risk Value", "Planned Mitigation Completion Date", "Risk Treatment Action", "Revised Vulnerability Rating",
  "Revised Threat Frequency", "Revised Threat Impact", "Revised Threat Value", "Revised Risk Value", "Actual Mitigation Completion Date", "Risk Treatment Option"
];

function fuzzyMatch(required, actualHeaders) {
  const reqWords = required.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().split(' ').filter(Boolean);
  for (const actual of actualHeaders) {
    const actualNorm = actual.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    if (reqWords.every(word => actualNorm.includes(word))) {
      return actual;
    }
  }
  return null;
}

// Add a helper function to compare two rows ignoring 'Sr#'
function isDuplicateRow(rowA: any, rowB: any) {
  const keysA = Object.keys(rowA).filter(k => k !== 'Sr#');
  const keysB = Object.keys(rowB).filter(k => k !== 'Sr#');
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => rowA[key] === rowB[key]);
}

export default function RiskAssessmentPage() {
  const { setData, data: storeData } = useRiskData();
  const [localData, setLocalData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadMode, setUploadMode] = useState('replace');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [duplicateInfo, setDuplicateInfo] = useState<{duplicates: number, added: number} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const filteredData = localData.filter(row =>
    Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (storeData.length > 0 && localData.length === 0) {
      setLocalData(storeData);
      setHeaders(Object.keys(storeData[0] || {}));
    }
  }, [storeData]);

  const getNextSrNumber = () => {
    const srValues = localData.map(item => parseInt(item["Sr#"]) || 0);
    return srValues.length ? Math.max(...srValues) + 1 : 1;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let parsed = results.data;
        const keys = Object.keys(parsed[0] || {});

        const missing = REQUIRED_HEADERS.filter(req => !fuzzyMatch(req, keys));
        if (missing.length > 0) {
          setUploadError(`Cannot upload file. Missing columns: [${missing.map(m => `"${m}"`).join(", ")}]`);
          return;
        }

        setUploadError(null);

        if (!parsed[0]?.["Sr#"]) {
          parsed = parsed.map((row, idx) => ({
            ...row,
            ["Sr#"]: (uploadMode === 'append' ? getNextSrNumber() + idx : idx + 1).toString(),
          }));
        } else if (uploadMode === 'append') {
          const offset = getNextSrNumber();
          parsed = parsed.map((row, idx) => ({
            ...row,
            ["Sr#"]: (offset + idx).toString(),
          }));
        }

        if (uploadMode === 'append') {
          const existingRows = localData;
          const newRows = [];
          const duplicates = [];

          parsed.forEach(row => {
            const isDuplicate = existingRows.some(existing => isDuplicateRow(existing, row));
            if (isDuplicate) {
              duplicates.push(row);
            } else {
              newRows.push(row);
            }
          });

          if (duplicates.length > 0) {
            setDuplicateRows(duplicates);
            setDuplicateInfo({duplicates: duplicates.length, added: newRows.length});
          } else {
            setDuplicateRows([]);
            setDuplicateInfo(null);
          }

          // Assign new Sr# to only the new rows
          const offset = getNextSrNumber();
          const newRowsWithSr = newRows.map((row, idx) => ({ ...row, ["Sr#"]: (offset + idx).toString() }));
          const updatedData = [...existingRows, ...newRowsWithSr];
          setHeaders(Object.keys(updatedData[0] || {}));
          setLocalData(updatedData);
          setData(updatedData);
        } else {
          setDuplicateRows([]);
          setDuplicateInfo(null);
          setHeaders(Object.keys(parsed[0] || {}));
          setLocalData(parsed);
          setData(parsed);
        }

        setCurrentPage(1);
      }
    });
  };

  const handleDeleteCSV = () => {
    setLocalData([]);
    setData([]);
    setHeaders([]);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "risk_assessment.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Risk Assessment</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and evaluate organizational risks</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Total Records:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredData.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex-1 min-w-[250px] max-w-xl">
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={() => setShowCreateModal(true)} className="btn-primary whitespace-nowrap">
            + Create Risk
          </button>

          {localData.length > 0 && (
            <div className="flex gap-2 items-center text-sm">
              <span>Upload Mode:</span>
              <label className="inline-flex items-center gap-1">
                <input type="radio" name="uploadMode" value="replace" checked={uploadMode === 'replace'} onChange={() => setUploadMode('replace')} />
                Replace
              </label>
              <label className="inline-flex items-center gap-1">
                <input type="radio" name="uploadMode" value="append" checked={uploadMode === 'append'} onChange={() => setUploadMode('append')} />
                Append
              </label>
            </div>
          )}

          <label className="btn-secondary cursor-pointer whitespace-nowrap">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            📁 Upload CSV
          </label>

          <button onClick={handleDeleteCSV} className="btn-danger whitespace-nowrap" disabled={localData.length === 0}>
            🗑️ Delete CSV
          </button>

          <button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded whitespace-nowrap" disabled={filteredData.length === 0}>
            Export CSV
          </button>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-gray-100 dark:bg-slate-700">
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="px-6 py-4 font-semibold whitespace-nowrap">{header}</th>
                  ))}
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                    {headers.map((header, colIdx) => (
                      <td key={colIdx} className="px-6 py-4">{row[header] || "-"}</td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline" onClick={() => {
                          setEditingRisk(row);
                          setShowEditModal(true);
                        }}>Edit</button>
                        <button className="text-red-600 hover:underline" onClick={() => {
                          const index = (currentPage - 1) * ITEMS_PER_PAGE + rowIdx;
                          const updated = localData.filter((_, i) => i !== index);
                          setLocalData(updated);
                          setData(updated);
                        }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 p-4">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-black text-white" : ""}`}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {filteredData.length === 0 && localData.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
          <p className="text-slate-500">Upload a CSV file or create your first risk assessment to get started.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-4">Create Your First Risk</button>
        </div>
      )}

      {filteredData.length === 0 && localData.length > 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-slate-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {showCreateModal && (
        <RiskFormModal onClose={() => setShowCreateModal(false)} onSave={(newRisk) => {
          const srNumber = getNextSrNumber();
          const updated = [...localData, { ...newRisk, ["Sr#"]: srNumber.toString() }];
          setLocalData(updated);
          setData(updated);
        }} />
      )}

      {showEditModal && editingRisk && (
        <RiskFormModal initialData={editingRisk} onClose={() => {
          setEditingRisk(null);
          setShowEditModal(false);
        }} onSave={(updatedRisk) => {
          const index = localData.findIndex((r) => r["Sr#"] === editingRisk["Sr#"]);
          const updated = [...localData];
          updated[index] = updatedRisk;
          setLocalData(updated);
          setData(updated);
        }} />
      )}

      {uploadError && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-50 border border-red-400 text-red-700 px-8 py-6 rounded shadow-lg text-lg font-semibold max-w-xl w-full text-center">
            {uploadError}
            <button className="block mx-auto mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => setUploadError(null)}>Close</button>
          </div>
        </div>
      )}

      {duplicateRows.length > 0 && duplicateInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-yellow-50 border border-yellow-500 text-yellow-800 px-8 py-6 rounded shadow-lg text-lg font-semibold max-w-xl w-full text-center">
            <p>{duplicateInfo.duplicates} duplicate row(s) were found and skipped during upload.<br/>{duplicateInfo.added} new row(s) were added.</p>
            <button className="block mx-auto mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => { setDuplicateRows([]); setDuplicateInfo(null); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
