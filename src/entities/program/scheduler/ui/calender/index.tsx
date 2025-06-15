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
import { colors } from '@/design-tokens';
import { Tooltip } from '@/shared/ui/tooltip';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();
  const { disabledDrops, setDisabledDrop, removeScheduleItem } =
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

  // const updateDisableByDayNums = (dayNums: number[], enabled: boolean) => {
  //   dayNums.forEach(dayNum => {
  //     if (dayNum <= 0) return;
  //     ['cognitive', 'daily'].forEach(category => {
  //       const id = `${dayNum}-${category}`;
  //       setDisabledDrop(id, !enabled); // 명시적 설정
  //       const item = schedule[dayNum]?.[category as 'cognitive' | 'daily'];
  //       if (!enabled && item) {
  //         removeScheduleItem(String(dayNum), item!.id);
  //       }
  //     });
  //   });
  // };

  const updateDisableByDayNums = (dayNums: number[], enabled: boolean) => {
    dayNums.forEach(dayNum => {
      if (dayNum <= 0) return;
      ['cognitive', 'daily'].forEach(category => {
        const id = `${dayNum}-${category}`;
        setDisabledDrop(id, !enabled); // ❗ 상태만 변경
        // ❌ removeScheduleItem 호출 제거!
      });
    });
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
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${activityCell} ${isDisabled ? disabledCell : ''}`}
            style={{
              minHeight: 60,
              backgroundColor: snapshot.isDraggingOver ? colors.brand[0] : ''
            }}
          >
            {item ? (
              <Draggable
                draggableId={`${dayNum}-${category}-${item.id}`}
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
                    <Tooltip
                      content={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'center'
                          }}
                        >
                          {item.thumbnailUrl && (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.content}
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                borderRadius: '4px'
                              }}
                            />
                          )}
                          <span>{item.content}</span>
                        </div>
                      }
                    >
                      <span>
                        {item.content.length > 5
                          ? `${item.content.slice(0, 5)}...`
                          : item.content}
                      </span>
                    </Tooltip>
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
              checked={weeks.every(
                week =>
                  week[dayIdx] === 0 ||
                  (!disabledDrops.has(`${week[dayIdx]}-cognitive`) &&
                    !disabledDrops.has(`${week[dayIdx]}-daily`))
              )}
              onChange={e => {
                const checked = e.target.checked;
                const dayNums = weeks
                  .map(week => week[dayIdx])
                  .filter(d => d > 0);
                updateDisableByDayNums(dayNums, checked);
              }}
            />
          </div>
        ))}
      </div>

      {/* 날짜별 행 */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 주차 */}
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel} ${weekLabelBg}`}>
              <span>{weekIdx + 1}주차</span>
              <input
                type="checkbox"
                checked={week.every(
                  dayNum =>
                    dayNum === 0 ||
                    (!disabledDrops.has(`${dayNum}-cognitive`) &&
                      !disabledDrops.has(`${dayNum}-daily`))
                )}
                onChange={e => {
                  const checked = e.target.checked;
                  updateDisableByDayNums(week, checked);
                }}
              />
            </div>

            {/* 날짜 + 개별 체크박스 */}
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
                      onChange={e =>
                        updateDisableByDayNums([dayNum], e.target.checked)
                      }
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
