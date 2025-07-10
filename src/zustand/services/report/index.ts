import { create } from 'zustand'

interface ReportStore {
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
}

export const useReportStore = create<ReportStore>()((set) => ({
  dateRange: { from: '', to: '' },
  setDateRange: (range) => set({ dateRange: range }),
}));