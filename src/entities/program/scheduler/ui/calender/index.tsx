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
import { useState, useEffect } from 'react';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();
  const { removeScheduleItem } = useScheduleStore();

  const [disabledDrops, setDisabledDrops] = useState<Set<string>>(new Set());
  const [checkedDays, setCheckedDays] = useState<Set<string>>(new Set()); // ✅ 날짜 체크 상태

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

  // ✅ 초기 체크 (처음에는 모든 날짜가 체크된 상태)
  useEffect(() => {
    const initialChecked = new Set<string>();
    for (let day = 1; day <= daysInMonth; day++) {
      initialChecked.add(day.toString());
    }
    setCheckedDays(initialChecked);
  }, [year, month]);

  // ✅ 드랍 비활성화/활성화 + 스케줄 삭제
  const toggleMultipleDropsDisabled = (
    droppableIds: string[],
    checked: boolean
  ) => {
    setDisabledDrops(prev => {
      const newSet = new Set(prev);

      droppableIds.forEach(id => {
        if (checked) {
          newSet.delete(id);
        } else {
          newSet.add(id);
          const [dayStr, category] = id.split('-');
          const dayNum = Number(dayStr);
          if (!isNaN(dayNum)) {
            removeScheduleItem(dayStr, dayNum);
          }
        }
      });

      return newSet;
    });
  };

  // ✅ 날짜 체크박스 상태 업데이트
  const toggleDayCheck = (dayNum: number, checked: boolean) => {
    setCheckedDays(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(dayNum.toString());
      } else {
        newSet.delete(dayNum.toString());
      }
      return newSet;
    });

    toggleMultipleDropsDisabled(
      [`${dayNum}-cognitive`, `${dayNum}-daily`],
      checked
    );
  };

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
                    style={{
                      display: 'flex',
                      gap: '4px',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <span>{item.content}</span>
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
              checked={weeks.some(
                week => week[i] > 0 && checkedDays.has(week[i].toString())
              )}
              onChange={e => {
                weeks.forEach(week => {
                  const dayNum = week[i];
                  if (dayNum > 0) {
                    toggleDayCheck(dayNum, e.target.checked);
                  }
                });
              }}
            />
          </div>
        ))}
      </div>

      {/* 주차 + 날짜 + 인지/일상 */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          <div className={grid}>
            {/* 주차 */}
            <div className={`${gridItem} ${weekLabel} ${weekLabelBg}`}>
              {weekIdx + 1}주차
              <input
                style={{ marginLeft: '8px' }}
                type="checkbox"
                checked={week.every(
                  dayNum => dayNum === 0 || checkedDays.has(dayNum.toString())
                )}
                onChange={e => {
                  week.forEach(dayNum => {
                    if (dayNum > 0) {
                      toggleDayCheck(dayNum, e.target.checked);
                    }
                  });
                }}
              />
            </div>

            {/* 날짜별 */}
            {week.map((dayNum, i) => (
              <div
                key={i}
                className={`${gridItem} ${weekLabelBg} ${i === 0 ? redText : ''} ${i === 6 ? blueText : ''}`}
              >
                {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
                {dayNum > 0 && (
                  <input
                    type="checkbox"
                    checked={checkedDays.has(dayNum.toString())}
                    onChange={e => toggleDayCheck(dayNum, e.target.checked)}
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

          {/* 일상생활 */}
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
