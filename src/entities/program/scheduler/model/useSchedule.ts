import { useState } from 'react';
import { Schedule } from '../../type.dto';

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [history, setHistory] = useState<Schedule[]>([]);
  const [redoStack, setRedoStack] = useState<Schedule[]>([]);
  console.log(schedule, history, redoStack);

  // 새로운 일정 추가 (setSchedule 대신 사용)
  const updateSchedule = (newSchedule: Schedule) => {
    console.log('🔄 updateSchedule 호출됨! 새로운 schedule:', newSchedule);

    setHistory(prev => [...prev, schedule]); // 현재 상태 저장
    setSchedule(newSchedule);
    setRedoStack([]); // 새 변경이 발생하면 Redo 스택 초기화
  };

  // 실행 취소 (Undo)
  const undo = () => {
    if (history.length === 0) return;
    const prevSchedule = history[history.length - 1];
    setRedoStack(prev => [schedule, ...prev]); // 현재 상태를 Redo 스택에 추가
    setSchedule(prevSchedule); // 이전 상태로 복원
    setHistory(prev => prev.slice(0, -1)); // 마지막 히스토리 제거
  };

  // 다시 실행 (Redo)
  const redo = () => {
    if (redoStack.length === 0) return;
    const nextSchedule = redoStack[0];
    setHistory(prev => [...prev, schedule]); // 현재 상태를 히스토리에 추가
    setSchedule(nextSchedule); // 복원
    setRedoStack(prev => prev.slice(1)); // Redo 스택에서 제거
  };

  return { schedule, updateSchedule, undo, redo };
}
