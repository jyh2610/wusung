import React from 'react';

const gradeColors: Record<number, string> = {
  1: '#FFB800', // 주황
  2: '#FFB800',
  3: '#FFB800',
  4: '#43B02A', // 초록
  5: '#43B02A',
  6: '#43B02A'
};

export function GradeCircle({ grade }: { grade: number }) {
  const color = gradeColors[grade] || '#ccc';
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12
      }}
    >
      {grade}
    </div>
  );
}
export function DifficultyBadge({ level }: { level: number }) {
  const map: Record<number, { text: string; color: string }> = {
    1: { text: '상', color: '#F25C5C' },
    2: { text: '중', color: '#FFA53B' },
    3: { text: '하', color: '#4CD964' }
  };
  const { text, color } = map[level] || { text: '-', color: '#ccc' };

  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '30%',
        background: color,
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {text}
    </div>
  );
}
