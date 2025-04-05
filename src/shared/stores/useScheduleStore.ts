// 📌 stores/useScheduleStore.ts
import { Schedule } from '@/entities/program/type.dto';
import { create } from 'zustand';

interface ScheduleState {
  schedule: Schedule;
  history: Schedule[];
  redoStack: Schedule[];
  updateSchedule: (newSchedule: Schedule) => void;
  undo: () => void;
  redo: () => void;
  reInit: () => void; // ✅ 초기화 기능 추가
}

// ✅ Zustand 스토어 생성
export const useScheduleStore = create<ScheduleState>(set => ({
  schedule: {},
  history: [],
  redoStack: [],

  // ✅ 일정 업데이트
  updateSchedule: newSchedule =>
    set(state => ({
      history: [...state.history, state.schedule], // 변경 전 상태 저장
      schedule: newSchedule,
      redoStack: [] // 새로운 변경이 생기면 redoStack 초기화
    })),

  // ✅ 실행 취소 (Undo)
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

  // ✅ 다시 실행 (Redo)
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

  // ✅ 초기화 (Undo 가능하도록 수정)
  reInit: () =>
    set(state => ({
      history: [...state.history, state.schedule], // 초기화 이전 상태 저장
      redoStack: [],
      schedule: {} // 스케줄만 초기화
    }))
}));
