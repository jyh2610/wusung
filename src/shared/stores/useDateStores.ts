// src/shared/stores/useDateStore.ts

import { create } from 'zustand';

interface DateState {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

const today = new Date();

export const useDateStore = create<DateState>(set => ({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  setYear: year => set({ year }),
  setMonth: month => set({ month }),
  goToPrevMonth: () =>
    set(state => {
      if (state.month === 1) {
        return { month: 12, year: state.year - 1 };
      }
      return { month: state.month - 1 };
    }),
  goToNextMonth: () =>
    set(state => {
      if (state.month === 12) {
        return { month: 1, year: state.year + 1 };
      }
      return { month: state.month + 1 };
    })
}));
