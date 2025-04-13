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
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();
  const [disabledDrops, setDisabledDrops] = useState<Set<string>>(new Set());
  const { removeScheduleItem } = useScheduleStore();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = firstDayOfMonth.getDay();
  const weeks: number[][] = [];

  const toggleMultipleDropsDisabled = (droppableIds: string[]) => {
    setDisabledDrops(prev => {
      const newSet = new Set(prev);
      droppableIds.forEach(id => {
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      });
      return newSet;
    });
  };

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
    colIdx: number
  ) => {
    const item = schedule[dayNum]?.[category];
    const droppableId =
      dayNum === 0
        ? `disabled-${weekIdx}-${colIdx}-${category}`
        : `${dayNum}-${category}`;

    const isDisabled = dayNum === 0 || disabledDrops.has(droppableId);
    const handleDelete = () => {
      // 삭제 함수 호출
      if (dayNum > 0 && item) {
        removeScheduleItem(String(dayNum), item.id);
      }
    };
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
                    <MdDelete onClick={handleDelete} />
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
      {/* 요일 헤더 */}
      <div className={grid}>
        <div className={weekgridItem} />
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`${weekgridItem} ${weekDay} ${i === 0 ? redText : ''} ${i === 6 ? blueText : ''}`}
          >
            <span>{day}</span>
            <input
              type="checkbox"
              onChange={() => {
                const idsToToggle: string[] = [];
                weeks.forEach(week =>
                  week.forEach((dayNum, idx) => {
                    if (idx === i && dayNum > 0) {
                      idsToToggle.push(
                        `${dayNum}-cognitive`,
                        `${dayNum}-daily`
                      );
                    }
                  })
                );
                toggleMultipleDropsDisabled(idsToToggle);
              }}
            />
          </div>
        ))}
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 날짜 행 */}
          <div className={grid}>
            {/* 주차 체크박스 */}
            <div className={`${gridItem} ${weekLabel} ${weekLabelBg}`}>
              {weekIdx + 1}주차
              <input
                style={{ marginLeft: '8px' }}
                type="checkbox"
                onChange={() => {
                  const idsToToggle: string[] = [];
                  week.forEach(dayNum => {
                    if (dayNum > 0) {
                      idsToToggle.push(
                        `${dayNum}-cognitive`,
                        `${dayNum}-daily`
                      );
                    }
                  });
                  toggleMultipleDropsDisabled(idsToToggle);
                }}
              />
            </div>

            {/* 날짜별 체크박스 */}
            {week.map((dayNum, i) => (
              <div
                key={i}
                className={`${gridItem} ${weekLabelBg} ${i === 0 ? redText : ''} ${i === 6 ? blueText : ''}`}
              >
                {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
                {dayNum > 0 && (
                  <input
                    type="checkbox"
                    onChange={() =>
                      toggleMultipleDropsDisabled([
                        `${dayNum}-cognitive`,
                        `${dayNum}-daily`
                      ])
                    }
                  />
                )}
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
