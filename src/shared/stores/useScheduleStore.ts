// 📌 stores/useScheduleStore.ts
import { Schedule, ScheduleItem } from '@/entities/program/type.dto';
import { create } from 'zustand';
// interface ScheduleState {
//   schedule: Schedule;
//   history: Schedule[];
//   redoStack: Schedule[];

//   coverItems: Schedule;
//   etcItems: Schedule[]; // ✅ 기타에 드랍된 항목들

//   updateSchedule: (newSchedule: Schedule) => void;
//   undo: () => void;
//   redo: () => void;
//   reInit: () => void;

//   addCoverItem: (item: Schedule) => void;
//   clearCoverItems: () => void;

//   addEtcItem: (item: Schedule) => void; // ✅ 기타 추가
//   clearEtcItems: () => void; // ✅ 기타 초기화
// }

interface ScheduleState {
  schedule: Schedule;
  history: Schedule[];
  redoStack: Schedule[];

  coverItems: ScheduleItem; // ✅ 단일 객체 또는 null
  etcItems: ScheduleItem[];

  updateSchedule: (newSchedule: Schedule) => void;
  undo: () => void;
  redo: () => void;
  reInit: () => void;

  addCoverItem: (item: ScheduleItem) => void;
  clearCoverItems: () => void;

  addEtcItem: (item: ScheduleItem) => void;
  clearEtcItems: () => void;
}

export const useScheduleStore = create<ScheduleState>(set => ({
  schedule: {},
  history: [],
  redoStack: [],
  coverItems: { id: 0, content: '' }, // ✅ 초기값도 null
  etcItems: [],

  updateSchedule: newSchedule =>
    set(state => ({
      history: [...state.history, state.schedule],
      schedule: newSchedule,
      redoStack: []
    })),

  undo: () => {
    return set(state => {
      if (state.history.length === 0) return state;
      const prevSchedule = state.history[state.history.length - 1];
      return {
        history: state.history.slice(0, -1),
        redoStack: [state.schedule, ...state.redoStack],
        schedule: prevSchedule
      };
    });
  },

  redo: () => {
    return set(state => {
      if (state.redoStack.length === 0) return state;
      const nextSchedule = state.redoStack[0];
      return {
        history: [...state.history, state.schedule],
        redoStack: state.redoStack.slice(1),
        schedule: nextSchedule
      };
    });
  },

  reInit: () => ({
    schedule: {},
    history: [],
    redoStack: [],
    coverItems: null,
    etcItems: []
  }),

  addCoverItem: item =>
    set({
      coverItems: item // ✅ 하나만
    }),

  clearCoverItems: () => set({ coverItems: { id: 0, content: '' } }),

  addEtcItem: item =>
    set(state => ({
      etcItems: [...state.etcItems, item]
    })),

  clearEtcItems: () => set({ etcItems: [] })
}));
