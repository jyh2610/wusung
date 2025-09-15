import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { freeCount } from '@/entities/program/api/free';

export interface FreeCountResponse {
  totalCount: number;
  usedCount: number;
}

interface FreeCountState {
  usedCount: FreeCountResponse | undefined;
  isStillTrial: boolean;
  isLoading: boolean;
  lastFetchTime: number | null;
  setUsedCount: (count: FreeCountResponse | undefined) => void;
  fetchFreeCount: () => Promise<void>;
  updateUsedCount: () => Promise<void>;
  calculateIsStillTrial: (isFree: boolean) => void;
}

const CACHE_DURATION = 5000; // 5초 캐시

export const useFreeCountStore = create<FreeCountState>()(
  devtools(
    (set, get) => ({
      usedCount: undefined,
      isStillTrial: false,
      isLoading: false,
      lastFetchTime: null,

      setUsedCount: count => {
        set({ usedCount: count });
      },

      fetchFreeCount: async () => {
        const { isLoading, lastFetchTime, usedCount } = get();

        // 이미 로딩 중이면 중복 호출 방지
        if (isLoading) {
          return;
        }

        // 캐시된 데이터가 있고 5초 이내라면 중복 호출 방지
        const now = Date.now();
        if (
          usedCount &&
          lastFetchTime &&
          now - lastFetchTime < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoading: true });

        try {
          const res = await freeCount();
          if (res) {
            set({
              usedCount: res,
              lastFetchTime: now
            });
          }
        } catch (error) {
          console.error('Failed to fetch free count:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateUsedCount: async () => {
        const { fetchFreeCount } = get();
        await fetchFreeCount();
      },

      calculateIsStillTrial: (isFree: boolean) => {
        const { usedCount } = get();
        if (
          isFree &&
          usedCount?.usedCount !== undefined &&
          usedCount?.totalCount !== undefined &&
          usedCount.usedCount < usedCount.totalCount
        ) {
          set({ isStillTrial: true });
        } else {
          set({ isStillTrial: false });
        }
      }
    }),
    {
      name: 'free-count-store'
    }
  )
);
