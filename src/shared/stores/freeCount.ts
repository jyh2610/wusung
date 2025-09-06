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
  setUsedCount: (count: FreeCountResponse | undefined) => void;
  fetchFreeCount: () => Promise<void>;
  updateUsedCount: () => Promise<void>;
  calculateIsStillTrial: (isFree: boolean) => void;
}

export const useFreeCountStore = create<FreeCountState>()(
  devtools(
    (set, get) => ({
      usedCount: undefined,
      isStillTrial: false,

      setUsedCount: count => {
        set({ usedCount: count });
      },

      fetchFreeCount: async () => {
        try {
          const res = await freeCount();
          if (res) {
            set({ usedCount: res });
          }
        } catch (error) {
          console.error('Failed to fetch free count:', error);
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
