// 📂 stores/useScheduleStore.ts

'use client';

import { create } from 'zustand';
import { Schedule, ScheduleItem } from '@/entities/program/type.dto';

interface ScheduleState {
  schedule: Schedule;
  history: Schedule[];
  redoStack: Schedule[];

  coverItems: ScheduleItem;
  etcItems: ScheduleItem[];

  noPrintDate: boolean;

  disabledDrops: Set<string>; // ✅ 추가

  updateSchedule: (newSchedule: Schedule) => void;
  undo: () => void;
  redo: () => void;
  reInit: () => void;

  toggleNoPrintDate: () => void;
  toggleDisabledDrop: (id: string) => void; // ✅ 토글 함수
  clearDisabledDrops: () => void; // ✅ 비우기 함수

  removeScheduleItem: (dateKey: string, itemId: number) => void;
  removeCoverItems: () => void;
  removeEtcItem: (id: number) => void;
  addCoverItem: (item: ScheduleItem) => void;
  clearCoverItems: () => void;
  addEtcItem: (item: ScheduleItem) => void;
  clearEtcItems: () => void;
}

export const useScheduleStore = create<ScheduleState>(set => ({
  schedule: {},
  history: [],
  redoStack: [],
  coverItems: { id: 0, content: '' },
  etcItems: [],
  disabledDrops: new Set(),
  noPrintDate: true,

  toggleNoPrintDate: () =>
    set(state => ({
      noPrintDate: !state.noPrintDate
    })),

  updateSchedule: newSchedule =>
    set(state => ({
      history: [...state.history, state.schedule],
      schedule: newSchedule,
      redoStack: []
    })),

  toggleDisabledDrop: id =>
    set(state => {
      const newSet = new Set(state.disabledDrops);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return { disabledDrops: newSet };
    }),

  clearDisabledDrops: () => set({ disabledDrops: new Set() }),

  undo: () =>
    set(state => {
      if (state.history.length === 0) return state;
      const prevSchedule = state.history[state.history.length - 1];
      return {
        history: state.history.slice(0, -1),
        redoStack: [state.schedule, ...state.redoStack],
        schedule: prevSchedule
      };
    }),

  redo: () =>
    set(state => {
      if (state.redoStack.length === 0) return state;
      const nextSchedule = state.redoStack[0];
      return {
        history: [...state.history, state.schedule],
        redoStack: state.redoStack.slice(1),
        schedule: nextSchedule
      };
    }),

  reInit: () =>
    set({
      schedule: {},
      history: [],
      redoStack: [],
      coverItems: { id: 0, content: '' },
      etcItems: [],
      disabledDrops: new Set() // ✅ 초기화할 때 같이 초기화
    }),

  removeScheduleItem: (dateKey, itemId) =>
    set(state => {
      const daySchedule = state.schedule[Number(dateKey)];
      if (!daySchedule) return state;

      const newDaySchedule = Object.fromEntries(
        Object.entries(daySchedule).filter(([_, item]) => item?.id !== itemId)
      );

      return {
        schedule: {
          ...state.schedule,
          [dateKey]: newDaySchedule
        }
      };
    }),

  removeCoverItems: () => set({ coverItems: { id: 0, content: '' } }),

  removeEtcItem: id =>
    set(state => ({
      etcItems: state.etcItems.filter(item => item.id !== id)
    })),

  addCoverItem: item => set({ coverItems: item }),
  clearCoverItems: () => set({ coverItems: { id: 0, content: '' } }),

  addEtcItem: item =>
    set(state => ({
      etcItems: [...state.etcItems, item]
    })),
  clearEtcItems: () => set({ etcItems: [] })
}));
