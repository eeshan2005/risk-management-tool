"use client";

import Papa from "papaparse";
import { useState, useEffect } from "react";
import { useRiskData } from "@/store/useRiskData";
import Search from '@/app/ui/search';
import RiskFormModal from '@/app/ui/RiskFormModal'; // ✅ ADDED for CRUD modal

export default function RiskAssessmentPage() {
  const { setData, data: storeData } = useRiskData();
  const [localData, setLocalData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ CRUD states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const filteredData = localData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
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
      const keys = Object.keys(storeData[0] || {});
      setHeaders(keys);
    }
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
        setData(parsed);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:scale-105"
          >
            + Create Risk
          </button>
          <label className="inline-block bg-black text-white px-6 py-3 rounded-lg cursor-pointer shadow hover:scale-105 transition w-fit">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            Upload CSV File
          </label>
        </div>
      </div>

      {localData.length > 0 && (
        <div className="w-full max-w-md">
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <div className="overflow-x-auto rounded border border-gray-300 bg-white mb-6" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <table className="table-auto w-full border-collapse text-sm text-left">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="p-3 border font-semibold border-gray-300 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                    <th className="p-3 border font-semibold border-gray-300 whitespace-nowrap">Actions</th> {/* ✅ ADDED */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50">
                      {headers.map((header, colIdx) => (
                        <td key={colIdx} className="p-3 border border-gray-200 align-top">
                          {row[header] || "-"}
                        </td>
                      ))}
                      <td className="p-3 border border-gray-200">
                        <button
                          className="text-blue-600 underline mr-2"
                          onClick={() => {
                            setEditingRisk(row);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 underline"
                          onClick={() => {
                            const index = (currentPage - 1) * ITEMS_PER_PAGE + rowIdx;
                            const updated = localData.filter((_, i) => i !== index);
                            setLocalData(updated);
                            setData(updated);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-black text-white" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Create Modal */}
      {showCreateModal && (
        <RiskFormModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newRisk) => {
            const updated = [...localData, newRisk];
            setLocalData(updated);
            setData(updated);
          }}
        />
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && editingRisk && (
        <RiskFormModal
          initialData={editingRisk}
          onClose={() => {
            setEditingRisk(null);
            setShowEditModal(false);
          }}
          onSave={(updatedRisk) => {
            const index = localData.findIndex((r) => r["Sr#"] === editingRisk["Sr#"]);
            const updated = [...localData];
            updated[index] = updatedRisk;
            setLocalData(updated);
            setData(updated);
          }}
        />
      )}
    </div>
  );
}  