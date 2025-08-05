import { create } from "zustand";
import { Court, MapBounds } from "@/types";

interface CourtStore {
  courts: Court[];
  selectedCourt: Court | null;
  mapBounds: MapBounds | null;
  isLoading: boolean;
  setCourts: (courts: Court[]) => void;
  setSelectedCourt: (court: Court | null) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
  setLoading: (loading: boolean) => void;
  addCourt: (court: Court) => void;
  updateCourt: (id: string, updates: Partial<Court>) => void;
}

export const useCourtStore = create<CourtStore>((set) => ({
  courts: [],
  selectedCourt: null,
  mapBounds: null,
  isLoading: false,
  setCourts: (courts) => set({ courts }),
  setSelectedCourt: (court) => set({ selectedCourt: court }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  setLoading: (loading) => set({ isLoading: loading }),
  addCourt: (court) =>
    set((state) => ({
      courts: [...state.courts, court],
    })),
  updateCourt: (id, updates) =>
    set((state) => ({
      courts: state.courts.map((court) =>
        court.id === id ? { ...court, ...updates } : court
      ),
      selectedCourt:
        state.selectedCourt?.id === id
          ? { ...state.selectedCourt, ...updates }
          : state.selectedCourt,
    })),
}));
