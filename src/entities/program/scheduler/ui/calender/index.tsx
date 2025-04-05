'use client';

import { Droppable } from '@hello-pangea/dnd';
import {
  container,
  grid,
  gridItem,
  weekLabel,
  activityRow,
  activityCell,
  activityLabel,
  weekDay,
  redText,
  blueText,
  weekgridItem
} from './index.css';
import { Schedule } from '@/entities/program/type.dto';
import { useDateStore } from '@/shared/stores/useDateStores';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  // ✅ 전역 상태에서 가져오기
  const { year, month } = useDateStore(); // month는 1~12

  // ✅ 정확한 날짜 계산을 위해 month - 1 사용
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월 마지막 날짜
  const startDay = firstDayOfMonth.getDay(); // 해당 월 1일의 요일 (0: 일요일)

  // ✅ 달력 구조 생성
  const weeks: number[][] = [];
  let currentWeek: number[] = new Array(startDay).fill(0);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className={container}>
      {/* 요일 헤더 */}
      <div className={grid}>
        <div className={weekgridItem} /> {/* 빈 칸 */}
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`${weekgridItem} ${weekDay} ${i === 0 ? redText : ''} ${
              i === 6 ? blueText : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 주차별 렌더링 */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 날짜 표시 */}
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel}`}>{weekIdx + 1}주차</div>
            {week.map((dayNum, i) => (
              <div
                key={i}
                className={`${gridItem} ${i === 0 ? redText : ''} ${
                  i === 6 ? blueText : ''
                }`}
              >
                {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
              </div>
            ))}
          </div>

          {/* 인지활동 영역 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>인지활동</div>
            </div>
            {week.map((dayNum, i) => (
              <Droppable
                key={`cognitive-${dayNum}-${i}`}
                droppableId={`${dayNum}-cognitive`}
                isDropDisabled={dayNum === 0}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={activityCell}
                  >
                    {dayNum > 0 && schedule[dayNum]?.cognitive
                      ? schedule[dayNum].cognitive.content
                      : '-'}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          {/* 일상생활 활동 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>
                일상생활 활동 & <br /> 추가 인지활동
              </div>
            </div>
            {week.map((dayNum, i) => (
              <Droppable
                key={`daily-${dayNum}-${i}`}
                droppableId={`${dayNum}-daily`}
                isDropDisabled={dayNum === 0}
              >
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={activityCell}
                  >
                    {dayNum > 0 && schedule[dayNum]?.daily
                      ? schedule[dayNum].daily.content
                      : '-'}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
