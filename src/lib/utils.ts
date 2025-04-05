import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// utils/scheduleConverter.ts
import { IContent } from '@/entities/program/type.dto';
import { Schedule } from '@/entities/program/type.dto';
export function convertToSchedule(
  data: any,
  allActivities: IContent[]
): Schedule {
  const result: Schedule = {};

  data.mainEduContentIds.forEach((ids: number[], index: number) => {
    if (!ids || ids.length === 0) return;

    const day = index + 1;

    const cognitiveId = ids[0];
    const dailyId = ids[1];

    const cognitiveActivity = allActivities.find(
      act => act.eduContentId === cognitiveId
    );
    const dailyActivity = allActivities.find(
      act => act.eduContentId === dailyId
    );

    const daySchedule: Schedule[number] = {};

    if (cognitiveActivity && cognitiveActivity.eduContentId !== undefined) {
      daySchedule.cognitive = {
        content: cognitiveActivity.title,
        eduContentId: cognitiveActivity.eduContentId
      };
    }

    if (dailyActivity && dailyActivity.eduContentId !== undefined) {
      daySchedule.daily = {
        content: dailyActivity.title,
        eduContentId: dailyActivity.eduContentId
      };
    }

    result[day] = daySchedule;
  });

  return result;
}

export const getLocalStorageValue = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export const setLocalStorageValue = (key: string, value: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.setItem(key, value);
};
