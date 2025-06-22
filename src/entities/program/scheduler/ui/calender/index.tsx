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
import { IoIosClose } from 'react-icons/io';
import { colors } from '@/design-tokens';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface CalendarProps {
  schedule: Schedule;
  isAdmin: boolean;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function Calendar({ schedule, isAdmin }: CalendarProps) {
  const { year, month } = useDateStore();
  const { disabledDrops, setDisabledDrop, removeScheduleItem, draggingItem } =
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

  const updateDisableByDayNums = (dayNums: number[], enabled: boolean) => {
    dayNums.forEach(dayNum => {
      if (dayNum <= 0) return;
      ['cognitive', 'daily'].forEach(category => {
        const id = `${dayNum}-${category}`;
        setDisabledDrop(id, !enabled);
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
                isDragDisabled={isDisabled}
              >
                {dragProvided => (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          display: 'flex',
                          gap: '4px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%',
                          minHeight: '40px',
                          ...dragProvided.draggableProps.style
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            fontSize: '12px',
                            wordBreak: 'break-all',
                            lineHeight: '1.2',
                            maxWidth: '120px'
                          }}
                        >
                          {item.content.length > 16
                            ? `${item.content.slice(0, 8)}\n${item.content.slice(8, 16)}...`
                            : item.content.length > 8
                              ? `${item.content.slice(0, 8)}\n${item.content.slice(8)}`
                              : item.content}
                        </span>
                        <IoIosClose
                          onClick={handleDelete}
                          className="text-red-500"
                          size={32}
                          style={{
                            cursor: 'pointer',
                            opacity:
                              draggingItem ===
                              `${dayNum}-${category}-${item.id}`
                                ? 0.5
                                : 1
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      sideOffset={5}
                      className="max-w-[320px] p-3"
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}
                      >
                        {item.thumbnailUrl && (
                          <div
                            style={{
                              width: '280px',
                              height: '200px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}
                          >
                            <img
                              src={item.thumbnailUrl}
                              alt={item.content}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '4px'
                              }}
                              onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML =
                                  '<span style="color: #ccc;">이미지 로드 실패</span>';
                              }}
                            />
                          </div>
                        )}
                        <span
                          style={{
                            fontWeight: 'bold',
                            fontSize: '12px',
                            wordBreak: 'break-all',
                            lineHeight: '1.2',
                            maxWidth: '120px'
                          }}
                        >
                          {item.content.length > 16
                            ? `${item.content.slice(0, 8)}\n${item.content.slice(8, 16)}...`
                            : item.content.length > 8
                              ? `${item.content.slice(0, 8)}\n${item.content.slice(8)}`
                              : item.content}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
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
    <TooltipProvider>
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
    </TooltipProvider>
  );
}
