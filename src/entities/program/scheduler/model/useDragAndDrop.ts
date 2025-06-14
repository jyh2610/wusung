import { DropResult, DragUpdate } from '@hello-pangea/dnd';
import { Dispatch, SetStateAction } from 'react';
import { IContent } from '../../type.dto';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { toast } from 'react-toastify';

export function useDragAndDrop(
  activities: IContent[],
  setActivities: Dispatch<SetStateAction<IContent[]>>
) {
  const { schedule, updateSchedule, addCoverItem, addEtcItem } =
    useScheduleStore();
  const coverItems = useScheduleStore(state => state.coverItems);
  const etcItems = useScheduleStore(state => state.etcItems);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [idStr, content] = draggableId.split('|');
    const id = Number(idStr);

    const [srcDayStr, srcCategory] = source.droppableId.split('-');
    const srcDay = Number(srcDayStr);
    const destId = destination.droppableId;

    // ✅ 커버 드랍
    if (destId === 'cover') {
      addCoverItem({ id, content });
      return;
    }
    console.log('Dropped onto ETC area!'); // 4. "etc" 블록 진입 확인

    // ✅ 기타 드랍
    if (destId === 'etc') {
      // 중복 체크
      if (etcItems.some(item => item.id === id)) {
        toast.error('이미 추가된 기타자료입니다.');
        return;
      }

      if (etcItems.length >= 2) {
        toast.error('기타자료는 최대 2개까지만 넣을 수 있어요!');
        return;
      }

      console.log('Calling addEtcItem with:', { id, content }); // 5. addEtcItem 호출 직전 확인
      addEtcItem({ id, content });
      return;
    }

    // ✅ 일반 드랍 (요일-카테고리)
    const [destDayStr, destCategory] = destId.split('-');
    const destDay = Number(destDayStr);

    // 같은 위치면 무시
    if (srcDay === destDay && srcCategory === destCategory) return;

    // 다른 카테고리에 같은 아이디가 있는지 확인
    const isDuplicate = schedule[destDay]
      ? Object.entries(schedule[destDay]).some(
          ([category, item]) => category !== destCategory && item?.id === id
        )
      : false;

    if (isDuplicate) {
      toast.error('같은 요일의 다른 카테고리에 이미 존재하는 활동입니다.');
      return;
    }

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
