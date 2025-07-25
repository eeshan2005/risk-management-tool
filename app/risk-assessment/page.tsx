"use client";

import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useState, useEffect, useRef } from "react";
import { useRiskData } from "@/store/useRiskData";
import Search from "@/app/ui/search";
import RiskFormModal from "@/app/ui/RiskFormModal";
import SaveRiskModal from "@/app/ui/SaveRiskModal";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { mapDbColumnsToCsvData } from "@/lib/headerMapping";
import { sanitizeDataForSupabase, getColumnMapping } from "@/lib/columnSanitizer";
import { useAuth } from "@/store/useAuth";

const REQUIRED_HEADERS = [
  "Sr#", "Business Process", "Date Risk Identified", "Risk Description", "Threats", "Vulnerabilities", "Existing Controls", "Risk Owner", "Controls / Clause No",
  "ISO 27001: 2022 Controls Reference", "Confidentiality", "Integrity", "Availability", "Max CIA Value", "Vulnerability Rating", "Threat Frequency",
  "Threat Impact", "Threat Value", "Risk Value", "Planned Mitigation Completion Date", "Risk Treatment Action", "Revised Vulnerability Rating",
  "Revised Threat Frequency", "Revised Threat Impact", "Revised Threat Value", "Revised Risk Value", "Actual Mitigation Completion Date", "Risk Treatment Option"
];

function fuzzyMatch(required: string, actualHeaders: string[]) {
  const reqWords = required.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().split(' ').filter(Boolean);
  for (const actual of actualHeaders) {
    const actualNorm = actual.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
    if (reqWords.every(word => actualNorm.includes(word))) {
      return actual;
    }
  }
  return null;
}

function isDuplicateRow(rowA: any, rowB: any) {
  const keysA = Object.keys(rowA).filter(k => k !== "Sr#");
  const keysB = Object.keys(rowB).filter(k => k !== "Sr#");
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => rowA[key] === rowB[key]);
}

export default function RiskAssessmentPage() {
  const router = useRouter();
  const { setData, data: storeData } = useRiskData();
  const [localData, setLocalData] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadMode, setUploadMode] = useState("replace");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Record<string, any> | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [duplicateRows, setDuplicateRows] = useState<Record<string, any>[]>([]);
  const [duplicateInfo, setDuplicateInfo] = useState<{ duplicates: number; added: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [originalData, setOriginalData] = useState<Record<string, any>[]>([]);
  const { user, profile, loading } = useAuth();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push("/login");
    }
  }, [user, profile, loading, router]);

  // Fetch risks for the user's company (assessor/reviewer) or all (admin)
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!profile) return;
      let companyId = null;
      let canEdit = false;
      let canView = false;
      let companyName = "";
      if (profile.role === "admin") {
        // Admin: can see all companies, use selectedCompany from URL if present
        const params = new URLSearchParams(window.location.search);
        companyId = params.get('company');
        if (companyId) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('name')
            .eq('id', companyId)
            .single();
          if (companyData) companyName = companyData.name;
        }
      } else {
        // Assessor/Reviewer: only their assigned company
        companyId = profile.company_id;
        if (companyId) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('name')
            .eq('id', companyId)
            .single();
          if (companyData) companyName = companyData.name;
        }
      }
      setSelectedCompany(companyId);
      setCompanyName(companyName);
      if (!companyId) {
        setLocalData([]);
        setData([]);
        setHeaders(REQUIRED_HEADERS);
        setOriginalData([]);
        return;
      }
      // Fetch risks for this company
      const { data: riskData } = await supabase
        .from('risks')
        .select('*')
        .eq('company_id', companyId)
        .order('sr_no');
      if (riskData && riskData.length > 0) {
        const mappedData = riskData.map(item => mapDbColumnsToCsvData(item));
        setLocalData(mappedData);
        setData(mappedData);
        setHeaders(Object.keys(mappedData[0] || {}));
        setOriginalData([...mappedData]);
      } else {
        setLocalData([]);
        setData([]);
        setHeaders(REQUIRED_HEADERS);
        setOriginalData([]);
      }
    };
    if (!loading && profile) fetchCompanyData();
    // eslint-disable-next-line
  }, [profile, loading, typeof window !== 'undefined' ? window.location.search : '']);

  const isAdmin = profile?.role === "admin";
  const isAssessor = profile?.role === "assessor";
  const isReviewer = profile?.role === "reviewer";

  const filteredData = localData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Filter headers to exclude ID fields and created_at
  const displayHeaders = headers.filter(header => 
    !['id', 'company_id', 'Id', 'Company_id', 'ID', 'COMPANY_ID', 'created_at', 'Created_at', 'CREATED_AT'].includes(header)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');
  
    if (!isExcel && !isCSV) {
      setUploadError("Invalid file type. Please upload a CSV or Excel file.");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
  
    const processData = (parsed: Record<string, any>[]) => {
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
          ["Sr#"]: (uploadMode === "append" ? getNextSrNumber() + idx : idx + 1).toString(),
        }));
      } else if (uploadMode === "append") {
        const offset = getNextSrNumber();
        parsed = parsed.map((row, idx) => ({
          ...row,
          ["Sr#"]: (offset + idx).toString(),
        }));
      }
  
      if (uploadMode === "append") {
        const existingRows = localData;
        const newRows: Record<string, any>[] = [];
        const duplicates: Record<string, any>[] = [];
  
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
          setDuplicateInfo({ duplicates: duplicates.length, added: newRows.length });
        } else {
          setDuplicateRows([]);
          setDuplicateInfo(null);
        }
  
        const offset = getNextSrNumber();
        const newRowsWithSr = newRows.map((row, idx) => ({
          ...row,
          ["Sr#"]: (offset + idx).toString(),
        }));
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
    };
  
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsed = XLSX.utils.sheet_to_json(worksheet);
          processData(parsed as Record<string, any>[]);
        } catch (error) {
          setUploadError("Error reading Excel file. Please check the file format.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isCSV) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data as Record<string, any>[]);
        }
      });
    }
  };

  const handleDeleteCSV = () => {
    setLocalData([]);
    setData([]);
    setHeaders([]);
    setCurrentPage(1);
    // Reset file input after successful processing
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds
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

  const handleSmartSave = async (selectedCompanyId: string, currentData = localData) => {
    if (!selectedCompanyId) {
      console.error('Please select a company');
      return;
    }
  
    try {
      // Compare current data with original data to find changes
      const newRisks: any[] = [];
      const updatedRisks: any[] = [];
      const deletedRisks: any[] = [];
  
      // Find new and updated risks
      currentData.forEach(currentRisk => {
        // Check if this risk has a database ID (could be 'id', 'Id', or 'ID')
        const riskId = currentRisk.id || currentRisk.Id || currentRisk.ID;
        const originalRisk = originalData.find(orig => {
          const origId = orig.id || orig.Id || orig.ID;
          return origId === riskId;
        });
        
        if (!originalRisk || !riskId) {
          // New risk (no ID or ID not found in original)
          newRisks.push(currentRisk);
        } else {
          // Check if risk was updated (exclude Sr# and id fields from comparison)
          const isUpdated = Object.keys(currentRisk).some(key => {
            if (['Sr#', 'sr_no', 'id', 'Id', 'ID', 'company_id', 'created_at'].includes(key)) {
              return false;
            }
            return currentRisk[key] !== originalRisk[key];
          });
          if (isUpdated) {
            updatedRisks.push({ current: currentRisk, original: originalRisk });
          }
        }
      });
  
      // Find deleted risks (in original but not in current)
      originalData.forEach(originalRisk => {
        const origId = originalRisk.id || originalRisk.Id || originalRisk.ID;
        const stillExists = currentData.find(curr => {
          const currId = curr.id || curr.Id || curr.ID;
          return currId === origId;
        });
        if (!stillExists && origId) {
          deletedRisks.push(originalRisk);
        }
      });
  
      console.log('Changes detected:', {
        new: newRisks.length,
        updated: updatedRisks.length,
        deleted: deletedRisks.length
      });
  
      // Perform database operations
      
      // 1. Delete removed risks
      for (const risk of deletedRisks) {
        const riskId = risk.id || risk.Id || risk.ID;
        if (riskId) {
          const { error } = await supabase
            .from('risks')
            .delete()
            .eq('id', riskId);
          if (error) throw error;
        }
      }
  
      // 2. Insert new risks
      if (newRisks.length > 0) {
        const sanitizedNewRisks = sanitizeDataForSupabase(newRisks);
        const newRisksWithCompany = sanitizedNewRisks.map(risk => {
          // Preserve the Sr# value by converting it to sr_no
          const srNo = risk.sr_no || parseInt(risk.Sr || risk["Sr#"] || "0");
          return {
            ...risk,
            sr_no: srNo,
            company_id: selectedCompanyId
          };
        });
  
        const { error } = await supabase
          .from('risks')
          .insert(newRisksWithCompany);
        if (error) throw error;
      }
  
      // 3. Update existing risks
      for (const { current, original } of updatedRisks) {
        const riskId = original.id || original.Id || original.ID;
        if (riskId) {
          const sanitizedRisk = sanitizeDataForSupabase([current])[0];
          const riskWithCompany = {
            ...sanitizedRisk,
            company_id: selectedCompanyId
          };
  
          const { error } = await supabase
            .from('risks')
            .update(riskWithCompany)
            .eq('id', riskId);
          if (error) throw error;
        }
      }
  
      // 4. Update serial numbers for all remaining risks
      const { data: allRisks, error: fetchError } = await supabase
        .from('risks')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('sr_no'); // Order by sr_no instead of created_at
  
      if (fetchError) throw fetchError;
  
      // Add this code to update serial numbers sequentially
      if (allRisks && allRisks.length > 0) {
        // Update serial numbers to be consecutive
        for (let i = 0; i < allRisks.length; i++) {
          const { error: updateError } = await supabase
            .from('risks')
            .update({ sr_no: i + 1 })
            .eq('id', allRisks[i].id);
          
          if (updateError) throw updateError;
        }
      }
  
      console.log('Smart save completed successfully');
    } catch (err: any) {
      console.error('Error in smart save:', err);
      throw err;
    }
  };


  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Risk Assessment</h1>
          {selectedCompany && companyName ? (
            <div className="flex items-center">
              <p className="text-slate-600">Viewing risks for company: </p>
              <span className="ml-1 font-semibold text-blue-600">{companyName}</span>
              <button 
                onClick={() => {
                  setSelectedCompany(null);
                  setCompanyName("");
                  router.push('/risk-assessment');
                }}
                className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <p className="text-slate-600">Manage and evaluate organizational risks</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Total Records:</span>
          <span className="font-semibold text-slate-700">{filteredData.length}</span>
        </div>
      </div>

      <div className="p-4 lg:p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="w-full">
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 lg:gap-3 items-center justify-between">
          {(isAdmin || isAssessor) && (
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn-primary text-sm w-full sm:w-auto"
              suppressHydrationWarning={true}
            >
              + Create Risk
            </button>
          )}

          <div className="flex flex-wrap gap-2 lg:gap-3 items-center w-full sm:w-auto">
            {(isAdmin || isAssessor) && localData.length > 0 && (
              <div className="flex gap-2 items-center text-xs lg:text-sm">
                <span className="text-slate-700 font-medium hidden lg:inline">Upload Mode:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <label className="inline-flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-gray-200">
                    <input 
                      type="radio" 
                      name="uploadMode" 
                      value="replace" 
                      checked={uploadMode === 'replace'} 
                      onChange={() => setUploadMode('replace')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-xs font-medium ${uploadMode === 'replace' ? 'text-blue-600' : 'text-gray-600'}`}>Replace</span>
                  </label>
                  <label className="inline-flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-gray-200">
                    <input 
                      type="radio" 
                      name="uploadMode" 
                      value="append" 
                      checked={uploadMode === 'append'} 
                      onChange={() => setUploadMode('append')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-xs font-medium ${uploadMode === 'append' ? 'text-blue-600' : 'text-gray-600'}`}>Append</span>
                  </label>
                </div>
              </div>
            )}

            {(isAdmin || isAssessor) && (
              <label className="btn-secondary cursor-pointer text-sm">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <span className="hidden lg:inline">📁 Upload CSV/Excel</span>
                <span className="lg:hidden">📁 Upload</span>
              </label>
            )}

            {(isAdmin || isAssessor) ? (
              <button onClick={handleDeleteCSV} className="btn-danger text-sm" disabled={localData.length === 0}>
                <span className="hidden lg:inline">🗑️ Delete CSV</span>
                <span className="lg:hidden">🗑️ Delete</span>
              </button>
            ) : null}

            <button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 lg:px-4 rounded text-sm" disabled={filteredData.length === 0}>
              <span className="hidden lg:inline">Export CSV</span>
              <span className="lg:hidden">Export</span>
            </button>
            {(isAdmin || isAssessor) && (
              <button 
                onClick={() => setShowSaveModal(true)} 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 lg:px-4 rounded text-sm" 
                disabled={filteredData.length === 0}
              >
                <span className="hidden lg:inline">Save to Database</span>
                <span className="lg:hidden">Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="relative">
          {/* Risk Level Legend */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Risk Value Legend</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>1-16 Negligible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>17-64 Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>65-128 Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>129-192 High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span>193-256 Very High</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
              <table className="w-full text-sm text-left table-fixed">
                <thead className="sticky top-0 bg-blue-600 text-white z-10">
                  <tr>
                    {displayHeaders.map((header, i) => {
                      // Define responsive column widths based on content importance
                      let colWidth = "w-24"; // default
                      if (header === "Sr#") colWidth = "w-16";
                      else if (header === "Business Process") colWidth = "w-40 lg:w-48";
                      else if (header === "Risk Description") colWidth = "w-48 lg:w-64";
                      else if (header === "Date Risk Identified") colWidth = "w-32";
                      else if (header === "Risk Value") colWidth = "w-20";
                      else if (header === "Risk Treatment Option") colWidth = "w-32";
                      else if (header.includes("Threat") || header.includes("Vulnerability")) colWidth = "w-24";

                      return (
                        <th key={i} className={`px-2 py-3 font-semibold text-white border-r border-blue-500 last:border-r-0 ${colWidth}`}>
                          <div className="truncate" title={header}>{header}</div>
                        </th>
                      );
                    })}
                    <th className="px-2 py-3 font-semibold text-white w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50 border-b border-gray-200">
                      {displayHeaders.map((header, colIdx) => {
                        const cellValue = row[header] || "-";
                        let cellClass = "px-2 py-3 text-slate-700 border-r border-gray-100 last:border-r-0";

                        // Apply color coding for Risk Value column
                        if (header === "Risk Value" && cellValue !== "-") {
                          const riskValue = Number(cellValue);
                          if (riskValue >= 1 && riskValue <= 16) {
                            cellClass += " bg-green-100 text-green-800 font-medium";
                          } else if (riskValue >= 17 && riskValue <= 64) {
                            cellClass += " bg-yellow-100 text-yellow-800 font-medium";
                          } else if (riskValue >= 65 && riskValue <= 128) {
                            cellClass += " bg-orange-100 text-orange-800 font-medium";
                          } else if (riskValue >= 129 && riskValue <= 192) {
                            cellClass += " bg-red-100 text-red-800 font-medium";
                          } else if (riskValue >= 193 && riskValue <= 256) {
                            cellClass += " bg-purple-100 text-purple-800 font-medium";
                          }
                        }

                        return (
                          <td key={colIdx} className={cellClass}>
                            <div className="truncate" title={cellValue}>
                              {cellValue}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-2 py-3 border-r border-gray-100">
                        <div className="flex flex-col gap-1">
                          {(isAdmin || isAssessor) && (
                            <>
                              <button 
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50" 
                                onClick={() => {
                                  setEditingRisk(row);
                                  setShowEditModal(true);
                                }}
                                title="Edit Risk"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50" 
                                onClick={() => {
                                  // Calculate the actual index in the full dataset
                                  const actualIndex = localData.findIndex(item => item["Sr#"] === row["Sr#"]);
                                  
                                  if (actualIndex !== -1) {
                                    // Remove the item from local data
                                    let updated = localData.filter((_, i) => i !== actualIndex);
                                    
                                    // Recalculate serial numbers for all items to be consecutive
                                    updated = updated.map((item, idx) => ({
                                      ...item,
                                      "Sr#": (idx + 1).toString()
                                    }));
                                    
                                    setLocalData(updated);
                                    setData(updated);
                                    
                                    // If we're on a page that no longer has data, go to previous page
                                    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
                                    if (currentPage > newTotalPages && newTotalPages > 0) {
                                      setCurrentPage(newTotalPages);
                                    }
                                  }
                                  
                                  // Note: Database changes will be applied when user clicks "Save to Database"
                                }}
                                title="Delete Risk"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Fixed at bottom with horizontal scroll */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sticky bottom-0">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white text-gray-700 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white text-gray-700 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredData.length === 0 && localData.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
          <p className="text-slate-500">Upload a CSV or Excel file or create your first risk assessment to get started.</p>
          {(isAdmin || isAssessor) && (
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn-primary mt-4"
              suppressHydrationWarning={true}
            >
              Create Your First Risk
            </button>
          )}
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
        <RiskFormModal 
          onClose={() => setShowCreateModal(false)} 
          selectedCompanyId={selectedCompany}
          onSave={(newRisk) => {
            const srNumber = getNextSrNumber();
            const riskWithMetadata = { 
              ...newRisk, 
              ["Sr#"]: srNumber.toString(),
              // Don't add database ID for new risks - let the database generate it
              ...(selectedCompany && { company_id: selectedCompany })
            };
            
            const updated = [...localData, riskWithMetadata];
            setLocalData(updated);
            setData(updated);
            
            // Note: Database changes will be applied when user clicks "Save to Database"
          }} 
        />
      )}

      {showEditModal && editingRisk && (
        <RiskFormModal 
          initialData={editingRisk} 
          selectedCompanyId={selectedCompany}
          onClose={() => {
            setEditingRisk(null);
            setShowEditModal(false);
          }} 
          onSave={(updatedRisk) => {
            // Preserve the original ID and other metadata when updating
            const riskId = editingRisk.id || editingRisk.Id || editingRisk.ID;
            const updatedRiskWithMetadata = {
              ...updatedRisk,
              ...(riskId && { id: riskId }), // Preserve the database ID
              "Sr#": editingRisk["Sr#"], // Keep the same serial number
              ...(selectedCompany && { company_id: selectedCompany })
            };
            
            // Find and update the exact row
            const index = localData.findIndex((r) => r["Sr#"] === editingRisk["Sr#"]);
            if (index !== -1) {
              const updated = [...localData];
              updated[index] = updatedRiskWithMetadata;
              setLocalData(updated);
              setData(updated);
            }
            
            // Note: Database changes will be applied when user clicks "Save to Database"
          }} 
        />
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

      {showSaveModal && (
        <SaveRiskModal 
          onClose={() => setShowSaveModal(false)} 
          onSuccess={async () => {
            setShowSaveModal(false);
            setSaveSuccess(true);
            
            // Refresh data from database to show updated state
            if (selectedCompany) {
              try {
                const { data: riskData } = await supabase
                  .from('risks')
                  .select('*')
                  .eq('company_id', selectedCompany)
                  .order('sr_no'); // Ensure consistent ordering by sr_no

                if (riskData && riskData.length > 0) {
                  const mappedData = riskData.map(item => mapDbColumnsToCsvData(item));
                  setLocalData(mappedData);
                  setData(mappedData);
                  setHeaders(Object.keys(mappedData[0]));
                  setOriginalData(mappedData); // Update original data
                }
              } catch (error) {
                console.error('Error refreshing data:', error);
              }
            }
            
            setTimeout(() => {
              setSaveSuccess(false);
            }, 3000);
          }}
          riskData={localData}
          onSmartSave={handleSmartSave}
        />
      )}

      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 fade-in">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Risk data saved to database successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}