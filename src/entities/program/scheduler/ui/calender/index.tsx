import {
  container,
  header,
  monthTitle,
  button,
  buttonOutline,
  grid,
  gridItem,
  weekLabel,
  highlighted,
  redText,
  blueText,
  activityRow,
  activityCell,
  activityLabel
} from './index.css';

type CalendarProps = {
  month: string;
  daysInMonth: number;
};

export function Calendar({ month, daysInMonth }: CalendarProps) {
  const weeks = Array.from(
    { length: Math.ceil(daysInMonth / 7) },
    (_, i) => i + 1
  );

  return (
    <div className={container}>
      <div className={grid}>
        <div className={redText}>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div className={blueText}>토</div>
      </div>

      {/* Calendar rows */}
      {weeks.map(week => (
        <div key={week}>
          <div className="grid grid-cols-8 border-b">
            <div className={gridItem}>
              <div className={weekLabel}>
                <span>{week}주차</span>
              </div>
            </div>
            {Array(7)
              .fill(0)
              .map((_, day) => {
                const dayNum = (week - 1) * 7 + day + 1;
                const isHighlighted = dayNum === 1;
                const isRed = day === 0 || [7, 14, 21, 28].includes(dayNum);
                const isBlue = day === 6 || [6, 13, 20, 27].includes(dayNum);

                return (
                  <div key={day} className={gridItem}>
                    <div
                      className={`${isRed ? redText : ''} ${isBlue ? blueText : ''} ${isHighlighted ? highlighted : ''}`}
                    >
                      {dayNum <= daysInMonth ? dayNum : ''}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Activity rows */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>인지활동</div>
            </div>
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={activityCell}>
                  -
                </div>
              ))}
          </div>
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>일상생활 활동 & 추가 인지활동</div>
            </div>
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={activityCell}>
                  -
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
