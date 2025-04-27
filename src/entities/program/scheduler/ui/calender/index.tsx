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
  weekLabelBg,
  disabledCell
} from './index.css';
import { Schedule } from '@/entities/program/type.dto';
import { useDateStore } from '@/shared/stores/useDateStores';
import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { MdDelete } from 'react-icons/md';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();
  const { disabledDrops, toggleDisabledDrop, removeScheduleItem } =
    useScheduleStore();

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

  const handleDisable = (dayNum: number) => {
    toggleDisabledDrop(`${dayNum}-cognitive`);
    toggleDisabledDrop(`${dayNum}-daily`);

    // ✅ 체크 해제되면 스케줄 데이터도 삭제
    if (schedule[dayNum]?.cognitive) {
      removeScheduleItem(String(dayNum), schedule[dayNum].cognitive!.id);
    }
    if (schedule[dayNum]?.daily) {
      removeScheduleItem(String(dayNum), schedule[dayNum].daily!.id);
    }
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
            className={`${activityCell} ${isDisabled ? disabledCell : ''}`}
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
        {weekdays.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className={`${weekgridItem} ${weekDay} ${dayIdx === 0 ? redText : ''} ${dayIdx === 6 ? blueText : ''}`}
          >
            <span>{day}</span>
            <input
              type="checkbox"
              checked={
                !weeks.some(
                  week =>
                    week[dayIdx] > 0 &&
                    (disabledDrops.has(`${week[dayIdx]}-cognitive`) ||
                      disabledDrops.has(`${week[dayIdx]}-daily`))
                )
              }
              onChange={() => {
                weeks.forEach(week => {
                  const dayNum = week[dayIdx];
                  if (dayNum > 0) {
                    handleDisable(dayNum);
                  }
                });
              }}
            />
          </div>
        ))}
      </div>

      {/* 날짜별 행 */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 날짜 체크 + 주차 */}
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel} ${weekLabelBg}`}>
              {weekIdx + 1}주차
              <input
                type="checkbox"
                checked={
                  !week.some(
                    dayNum =>
                      dayNum > 0 &&
                      (disabledDrops.has(`${dayNum}-cognitive`) ||
                        disabledDrops.has(`${dayNum}-daily`))
                  )
                }
                onChange={() => {
                  week.forEach(dayNum => {
                    if (dayNum > 0) {
                      handleDisable(dayNum);
                    }
                  });
                }}
              />
            </div>

            {/* 날짜 */}
            {week.map((dayNum, dayIdx) => (
              <div
                key={dayIdx}
                className={`${gridItem} ${weekLabelBg} ${dayIdx === 0 ? redText : ''} ${dayIdx === 6 ? blueText : ''}`}
              >
                {dayNum > 0 ? (
                  <>
                    {String(dayNum).padStart(2, '0')}
                    <input
                      type="checkbox"
                      checked={
                        !(
                          disabledDrops.has(`${dayNum}-cognitive`) ||
                          disabledDrops.has(`${dayNum}-daily`)
                        )
                      }
                      onChange={() => handleDisable(dayNum)}
                    />
                  </>
                ) : (
                  ''
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
              <div className={activityLabel}>일상생활</div>
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
