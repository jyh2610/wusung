'use client';

import { useState } from 'react';
import {
  container,
  grid,
  gridItem,
  weekLabel,
  highlighted,
  redText,
  blueText,
  activityRow,
  activityCell,
  activityLabel,
  weekDay
} from './index.css';

export function Calendar() {
  const [checkedDays, setCheckedDays] = useState<{ [key: number]: boolean }>(
    {}
  );

  // 📌 오늘 날짜 기준 현재 월 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth(); // 0 (Jan) ~ 11 (Dec)
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ];
  const month = monthNames[monthIndex];

  // 📌 이번 달의 총 일 수 계산
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // 📌 이번 달 1일의 요일 (0: 일요일, 6: 토요일)
  const startDay = new Date(year, monthIndex, 1).getDay();

  // 📌 주차별 날짜 배열 만들기
  const weeks: number[][] = [];
  let currentWeek: number[] = new Array(startDay).fill(0); // 시작 요일 맞추기

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 마지막 주 채우기
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  const toggleCheckbox = (dayNum: number) => {
    setCheckedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  return (
    <div className={container}>
      {/* 요일 헤더 */}
      <div className={`${grid} ${weekDay}`}>
        <div className={weekLabel} />
        <div className={redText}>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div className={blueText}>토</div>
      </div>

      {/* 주차별 날짜 및 활동 */}
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          {/* 날짜 행 */}
          <div className={grid}>
            <div className={`${gridItem} ${weekLabel}`}>
              {weekIdx + 1}주차
              <input type="checkbox" />
            </div>
            {week.map((dayNum, i) => {
              const isHighlighted = dayNum === today.getDate();
              const isRed = i === 0;
              const isBlue = i === 6;

              return (
                <div key={i} className={gridItem}>
                  <span
                    className={`${isRed ? redText : ''} ${isBlue ? blueText : ''} ${
                      isHighlighted ? highlighted : ''
                    }`}
                  >
                    {dayNum > 0 ? String(dayNum).padStart(2, '0') : ''}
                  </span>

                  {dayNum > 0 && (
                    <input
                      type="checkbox"
                      checked={!!checkedDays[dayNum]}
                      onChange={() => toggleCheckbox(dayNum)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 인지활동 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>인지활동</div>
            </div>
            {week.map((dayNum, i) => (
              <div key={i} className={activityCell}>
                {dayNum > 0 ? '-' : ''}
              </div>
            ))}
          </div>

          {/* 일상생활 활동 & 추가 인지활동 */}
          <div className={activityRow}>
            <div className={activityCell}>
              <div className={activityLabel}>일상생활 활동 & 추가 인지활동</div>
            </div>
            {week.map((dayNum, i) => (
              <div key={i} className={activityCell}>
                {dayNum > 0 ? '-' : ''}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
