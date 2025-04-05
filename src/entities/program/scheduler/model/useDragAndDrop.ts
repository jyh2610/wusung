import { DropResult, DragUpdate } from '@hello-pangea/dnd';
import { Dispatch, SetStateAction } from 'react';
import { IContent } from '../../type.dto';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

export function useDragAndDrop(
  activities: IContent[],
  setActivities: Dispatch<SetStateAction<IContent[]>>
) {
  const { schedule, updateSchedule } = useScheduleStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [idStr, content] = draggableId.split('|');
    const id = Number(idStr);

    const [srcDayStr, srcCategory] = source.droppableId.split('-');
    const [destDayStr, destCategory] = destination.droppableId.split('-');

    const srcDay = Number(srcDayStr);
    const destDay = Number(destDayStr);

    // 같은 위치면 무시
    if (srcDay === destDay && srcCategory === destCategory) return;

    const newSchedule = {
      ...schedule,
      [destDay]: {
        ...schedule[destDay],
        [destCategory]: { id, content }
      },
      [srcDay]: {
        ...schedule[srcDay],
        [srcCategory]: undefined
      }
    };

    updateSchedule(newSchedule);
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination } = update;
    if (destination) {
      const droppableElement = document.getElementById(destination.droppableId);
      droppableElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  return { onDragEnd, onDragUpdate };
}
