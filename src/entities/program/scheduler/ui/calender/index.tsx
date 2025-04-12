'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
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
  weekgridItem,
  weekLabelBg
} from './index.css';
import { Schedule } from '@/entities/program/type.dto';
import { useDateStore } from '@/shared/stores/useDateStores';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

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

  const renderCell = (
    dayNum: number,
    category: 'cognitive' | 'daily',
    weekIdx: number,
    colIdx: number // ← 추가!
  ) => {
    const item = schedule[dayNum]?.[category];
    const isDisabled = dayNum === 0;
    const droppableId = isDisabled
      ? `disabled-${weekIdx}-${colIdx}-${category}`
      : `${dayNum}-${category}`;
    return (
      <Droppable
        key={droppableId}
        droppableId={droppableId}
        isDropDisabled={isDisabled}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={activityCell}
          >
            {item ? (
              <Draggable
                draggableId={`${item.id}|${item.content}|${category}`}
                index={0}
              >
                {dragProvided => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ) : (
              '-'
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className={container}>
      <div className={grid}>
        <div className={weekgridItem} />
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`${weekgridItem} ${weekDay} ${i === 0 ? redText : ''} ${i === 6 ? blueText : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 날짜 행 */}
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel} ${weekLabelBg}`}>
              {weekIdx + 1}주차
            </div>
            {week.map((dayNum, i) => (
              <div
                key={i}
                className={`${gridItem} ${weekLabelBg} ${i === 0 ? redText : ''} ${i === 6 ? blueText : ''}`}
              >
                {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
              </div>
            ))}
          </div>

          {/* 인지활동 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>인지활동</div>
            </div>
            {week.map((dayNum, colIdx) =>
              renderCell(dayNum, 'cognitive', weekIdx, colIdx)
            )}
          </div>

          {/* 일상생활 + 추가 인지 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>일상생활 & 추가 인지활동</div>
            </div>
            {week.map((dayNum, colIdx) =>
              renderCell(dayNum, 'daily', weekIdx, colIdx)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
