'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { seedLaundries, type Laundry, type LaundryStatus } from './seed';

interface LaundryStore {
  laundries: Laundry[];
  bookLaundry: (laundryId: string, kg: number) => void;
  resetLaundries: () => void;
}

const getStatus = (load: number, capacity: number): LaundryStatus => {
  const usage = capacity === 0 ? 0 : load / capacity;
  if (usage >= 1) return 'full';
  if (usage >= 0.8) return 'busy';
  return 'open';
};

export const useLaundryStore = create<LaundryStore>()(
  persist(
    (set) => ({
      laundries: seedLaundries,
      bookLaundry: (laundryId, kg) =>
        set((state) => ({
          laundries: state.laundries.map((laundry) => {
            if (laundry.id !== laundryId) return laundry;
            const nextLoad = Math.min(laundry.capacity_kg, laundry.current_load_kg + kg);
            return {
              ...laundry,
              current_load_kg: nextLoad,
              status: getStatus(nextLoad, laundry.capacity_kg),
            };
          }),
        })),
      resetLaundries: () => set({ laundries: seedLaundries }),
    }),
    {
      name: 'laundry-optimizer-laundries',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ laundries: state.laundries }),
    },
  ),
);
