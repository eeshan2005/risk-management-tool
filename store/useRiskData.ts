import { create } from "zustand";

// Utility to sync with localStorage
const STORAGE_KEY = "riskData";

function loadData() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

type RiskDataStore = {
  data: any[];
  setData: (data: any[]) => void;
};

export const useRiskData = create<RiskDataStore>((set) => ({
  data: typeof window !== "undefined" ? loadData() : [],
  setData: (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    set({ data });
  },
}));
