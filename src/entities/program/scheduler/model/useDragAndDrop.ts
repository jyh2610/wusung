import { DropResult, DragUpdate, DragStart } from '@hello-pangea/dnd';
import { Dispatch, SetStateAction } from 'react';
import { IContent } from '../../type.dto';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { toast } from 'react-toastify';

export function useDragAndDrop(
  activities: IContent[],
  setActivities: Dispatch<SetStateAction<IContent[]>>
) {
  const { schedule, updateSchedule, addCoverItem, addEtcItem, disabledDrops, setDraggingItem } =
    useScheduleStore();
  const coverItems = useScheduleStore(state => state.coverItems);
  const etcItems = useScheduleStore(state => state.etcItems);

  const onDragStart = (start: DragStart) => {
    const { draggableId } = start;
    
    // 전역 드래그 상태 설정
    setDraggingItem(draggableId);
    
    // 캘린더 내부 드래그인지 확인
    if (draggableId.includes('-cognitive-') || draggableId.includes('-daily-')) {
      // 캘린더 내부 드래그는 스타일 변경 없이 처리
      return;
    }

    const [idStr, content, thumbnailUrl] = draggableId.split('|');

    // 드래그 중인 아이템의 스타일 설정
    const draggedElement = document.querySelector(
      `[data-rbd-draggable-id="${draggableId}"]`
    );
    if (draggedElement && thumbnailUrl) {
      const img = document.createElement('img');
      img.src = thumbnailUrl;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';

      const existingImg = draggedElement.querySelector('img');
      if (existingImg) {
        existingImg.remove();
      }
      draggedElement.appendChild(img);
    }
  };

  const onDragEnd = (result: DropResult) => {
    // 전역 드래그 상태 초기화
    setDraggingItem(null);
    
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // 캘린더 내부 드래그 처리
    if (draggableId.includes('-cognitive-') || draggableId.includes('-daily-')) {
      const [srcDayStr, srcCategory, itemIdStr] = draggableId.split('-');
      const srcDay = Number(srcDayStr);
      const itemId = Number(itemIdStr);

      // 소스 아이템 가져오기
      const srcItem = schedule[srcDay]?.[srcCategory as 'cognitive' | 'daily'];
      if (!srcItem) return;

      const [destDayStr, destCategory] = destination.droppableId.split('-');
      const destDay = Number(destDayStr);

      // 같은 위치면 무시
      if (srcDay === destDay && srcCategory === destCategory) return;

      // 대상 위치가 비활성화되어 있으면 무시
      if (disabledDrops.has(destination.droppableId)) {
        toast.error('해당 위치는 비활성화되어 있습니다.');
        return;
      }

      // 다른 카테고리에 같은 아이디가 있는지 확인
      const isDuplicate = schedule[destDay]
        ? Object.entries(schedule[destDay]).some(
            ([category, item]) => category !== destCategory && item?.id === itemId
          )
        : false;

      if (isDuplicate) {
        toast.error('같은 요일의 다른 카테고리에 이미 존재하는 활동입니다.');
        return;
      }

      // 스케줄 업데이트
      const newSchedule = {
        ...schedule,
        [destDay]: {
          ...schedule[destDay],
          [destCategory]: srcItem
        },
        [srcDay]: {
          ...schedule[srcDay],
          [srcCategory]: undefined
        }
      };

      updateSchedule(newSchedule);
      return;
    }

    // 외부에서 드래그된 아이템 처리
    const [idStr, content, thumbnailUrl] = draggableId.split('|');
    const id = Number(idStr);

    const [srcDayStr, srcCategory] = source.droppableId.split('-');
    const srcDay = Number(srcDayStr);
    const destId = destination.droppableId;

    // ✅ 커버 드랍
    if (destId === 'cover') {
      addCoverItem({ id, content, thumbnailUrl });
      return;
    }

    // ✅ 기타 드랍
    if (destId === 'etc') {
      // 중복 체크
      if (etcItems.some(item => item.id === id)) {
        toast.error('이미 추가된 기타자료입니다.');
        return;
      }

      if (etcItems.length >= 10) {
        toast.error('기타자료는 최대 10개까지만 넣을 수 있어요!');
        return;
      }

      addEtcItem({ id, content, thumbnailUrl });
      return;
    }

    // ✅ 일반 드랍 (요일-카테고리)
    const [destDayStr, destCategory] = destId.split('-');
    const destDay = Number(destDayStr);

    // 대상 위치가 비활성화되어 있으면 무시
    if (disabledDrops.has(destId)) {
      toast.error('해당 위치는 비활성화되어 있습니다.');
      return;
    }

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
        [destCategory]: { id, content, thumbnailUrl }
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

  return { onDragEnd, onDragUpdate, onDragStart };
}
