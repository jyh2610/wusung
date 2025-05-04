import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// utils/scheduleConverter.ts
import { CategoryNode, IContent } from '@/entities/program/type.dto';
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
      act => act.eduContentId === Number(cognitiveId)
    );
    const dailyActivity = allActivities.find(
      act => act.eduContentId === Number(dailyId)
    );

    const daySchedule: Schedule[number] = {};

    if (cognitiveActivity && cognitiveActivity.eduContentId !== undefined) {
      daySchedule.cognitive = {
        content: cognitiveActivity.title,
        id: cognitiveActivity.eduContentId
      };
    }

    if (dailyActivity && dailyActivity.eduContentId !== undefined) {
      daySchedule.daily = {
        content: dailyActivity.title,
        id: dailyActivity.eduContentId
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

type AnyTreeNode = Record<string, any>;

export function extractLeafNodes<T extends AnyTreeNode>(
  nodes: T[],
  childrenKey: keyof T = 'children' as keyof T
): T[] {
  const leaves: T[] = [];

  const traverse = (nodeList: T[]) => {
    nodeList.forEach(node => {
      const children = node[childrenKey] as T[] | undefined;

      if (!children || children.length === 0) {
        leaves.push(node);
      } else {
        traverse(children);
      }
    });
  };

  traverse(nodes);
  return leaves;
}
export const findEvaluationCategories = (
  nodes: CategoryNode[]
): CategoryNode[] => {
  const result: CategoryNode[] = [];

  const traverse = (nodeList: CategoryNode[]) => {
    for (const node of nodeList) {
      if (node.name === '평가자료') {
        result.push(node);
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
};

export const handleCurrentPathRoute = (id: string, pathname: string) => {
  const currentPath = pathname.replace(/\/$/, '');
  return `${currentPath}/${id}`;
};
