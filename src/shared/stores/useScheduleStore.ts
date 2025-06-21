// 📂 stores/useScheduleStore.ts

'use client';

import { create } from 'zustand';
import { Schedule, ScheduleItem } from '@/entities/program/type.dto';

interface ScheduleState {
  schedule: Schedule;
  history: Schedule[];
  redoStack: Schedule[];

  coverItems: ScheduleItem | null;
  etcItems: ScheduleItem[];

  savedSchedule: Record<string, Schedule>; // 년월일을 키값으로 스케줄 저장

  noPrintDate: boolean;

  disabledDrops: Set<string>; // ✅ 추가
  draggingItem: string | null; // 드래그 중인 아이템 추적

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
  setDisabledDrop: (id: string, disabled: boolean) => void;
  setDraggingItem: (itemId: string | null) => void; // 드래그 상태 설정

  // 저장된 스케줄 관련 함수들
  saveSchedule: (dateKey: string, schedule: Schedule) => void;
  loadSchedule: (dateKey: string) => void; // 스케줄을 로드하여 현재 스케줄로 설정
  removeSavedSchedule: (dateKey: string) => void;
  clearSavedSchedules: () => void;

  selectedDifficulty: number;
  setSelectedDifficulty: (difficulty: number) => void;

  // 월 변경 시 스케줄만 초기화 (기타자료, 커버자료 유지)
  resetScheduleOnly: (year?: number, month?: number) => void;
}

export const useScheduleStore = create<ScheduleState>(set => ({
  schedule: {},
  history: [],
  redoStack: [],
  coverItems: null,
  etcItems: [],
  savedSchedule: {}, // 년월일별 저장된 스케줄
  disabledDrops: new Set(),
  draggingItem: null, // 드래그 중인 아이템 초기값
  noPrintDate: true,
  selectedDifficulty: 2,

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
      coverItems: null,
      etcItems: [],
      savedSchedule: {},
      disabledDrops: new Set(),
      draggingItem: null,
      noPrintDate: true,
      selectedDifficulty: 2
    }),

  // 월 변경 시 스케줄만 초기화 (기타자료, 커버자료 유지)
  resetScheduleOnly: (year?: number, month?: number) =>
    set(state => {
      // 선택된 년월 또는 현재 년월에 저장된 스케줄이 있는지 확인
      const targetYear = year || new Date().getFullYear();
      const targetMonth = month || new Date().getMonth() + 1;
      const currentDateKey = `${targetYear}-${targetMonth.toString().padStart(2, '0')}`;
      const savedSchedule = state.savedSchedule[currentDateKey];
      
      console.log('🔍 resetScheduleOnly 디버깅:');
      console.log('📅 타겟 년월:', targetYear, targetMonth);
      console.log('📅 현재 날짜 키:', currentDateKey);
      console.log('💾 저장된 스케줄 전체:', state.savedSchedule);
      console.log('📋 현재 날짜의 저장된 스케줄:', savedSchedule);
      console.log('📊 현재 스케줄:', state.schedule);
      console.log('🎯 커버 아이템:', state.coverItems);
      console.log('📝 기타 아이템:', state.etcItems);
      
      if (savedSchedule) {
        // 저장된 스케줄이 있으면 로드
        console.log('✅ 저장된 스케줄을 로드합니다:', savedSchedule);
        return {
          schedule: savedSchedule,
          history: [],
          redoStack: [],
          disabledDrops: new Set(),
          draggingItem: null
        };
      } else {
        // 저장된 스케줄이 없으면 모든 데이터 리셋
        console.log('❌ 저장된 스케줄이 없어서 모든 데이터를 리셋합니다');
        return {
          schedule: {},
          history: [],
          redoStack: [],
          coverItems: null,
          etcItems: [],
          disabledDrops: new Set(),
          draggingItem: null
        };
      }
    }),

  // 저장된 스케줄 관련 함수들
  saveSchedule: (dateKey: string, schedule: Schedule) =>
    set(state => ({
      savedSchedule: {
        ...state.savedSchedule,
        [dateKey]: schedule
      }
    })),

  loadSchedule: (dateKey: string) =>
    set(state => {
      const savedSchedule = state.savedSchedule[dateKey] || null;
      return { schedule: savedSchedule || {} };
    }),

  removeSavedSchedule: (dateKey: string) =>
    set(state => {
      const newSavedSchedule = { ...state.savedSchedule };
      delete newSavedSchedule[dateKey];
      return { savedSchedule: newSavedSchedule };
    }),

  clearSavedSchedules: () => set({ savedSchedule: {} }),

  removeScheduleItem: (dateKey, itemId) =>
    set(state => {
      // 드래그 중인 아이템은 삭제하지 않음
      const itemKey = `${dateKey}-${itemId}`;
      if (state.draggingItem && state.draggingItem.includes(itemKey)) {
        return state;
      }

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

  setDisabledDrop: (id: string, disabled: boolean) =>
    set(state => {
      const newSet = new Set(state.disabledDrops);
      disabled ? newSet.add(id) : newSet.delete(id);
      return { disabledDrops: newSet };
    }),

  setDraggingItem: (itemId: string | null) => set({ draggingItem: itemId }),

  removeCoverItems: () => set({ coverItems: null }),

  removeEtcItem: id =>
    set(state => ({
      etcItems: state.etcItems.filter(item => item.id !== id)
    })),

  addCoverItem: item => set({ coverItems: item }),
  clearCoverItems: () => set({ coverItems: null }),

  addEtcItem: item =>
    set(state => {
      if (state.etcItems.some(existingItem => existingItem.id === item.id)) {
        return state;
      }
      return {
        etcItems: [...state.etcItems, item]
      };
    }),
  clearEtcItems: () => set({ etcItems: [] }),

  setSelectedDifficulty: difficulty => set({ selectedDifficulty: difficulty })
}));
