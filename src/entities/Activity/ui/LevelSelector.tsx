// 'use client';

// import React from 'react';

// interface Props {
//   selectedLevel: 'high' | 'medium' | 'low';
//   onClick: (level: 'high' | 'medium' | 'low') => void;
// }

// export const LevelSelector: React.FC<Props> = ({ selectedLevel, onClick }) => {
//   return (
//     <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
//       {(['high', 'medium', 'low'] as const).map(level => (
//         <div
//           key={level}
//           className={difficultyBox({
//             level,
//             selected: selectedLevel === level
//           })}
//           onClick={() => onClick(level)}
//         >
//           난이도 {level === 'high' ? '상' : level === 'medium' ? '중' : '하'}
//         </div>
//       ))}
//     </div>
//   );
// };
