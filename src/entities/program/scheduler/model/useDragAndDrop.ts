// 📌 hooks/useDragAndDrop.ts
import { DropResult, DragUpdate } from '@hello-pangea/dnd';
import { Dispatch, SetStateAction } from 'react';
import { IContent } from '../../type.dto';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

export function useDragAndDrop(
  activities: IContent[],
  setActivities: Dispatch<SetStateAction<IContent[]>>
) {
  const { schedule, updateSchedule } = useScheduleStore(); // ✅ Zustand 사용

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    const [numberStr, content] = draggableId.split('|');
    const id = Number(numberStr);

    if (!id || !content) {
      console.error('🚨 잘못된 draggableId 형식:', draggableId);
      return;
    }

    if (destination.droppableId === 'activityList') {
      return; // 원래 리스트로 복귀할 경우 처리 안 함
    }

    const [dayNum, category] = destination.droppableId.split('-');
    const day = Number(dayNum);

    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [category]: { id, content }
      }
    };

    updateSchedule(newSchedule); // ✅ Zustand에서 업데이트

    console.log(`📅 ${day}일 (${category})에 "${content}" 추가됨 (ID: ${id})`);
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination } = update;

    if (destination) {
      const droppableId = destination.droppableId;
      const droppableElement = document.getElementById(droppableId);

      if (droppableElement) {
        droppableElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  };

  return { onDragEnd, onDragUpdate };
}
