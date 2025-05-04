// import React from 'react';
// import Image from 'next/image';
// import { Checkbox } from '@mui/material';
// import * as styles from '../Activity.css';

// export function ActivityList({
//   activities,
//   selectedActivities,
//   handleActivitySelect
// }) {
//   if (!activities || activities.length === 0) {
//     return (
//       <div style={{ marginTop: '24px', textAlign: 'center', color: '#9e9e9e' }}>
//         활동지가 없습니다.
//       </div>
//     );
//   }

//   return (
//     <div className={styles.activityCardContainer}>
//       {activities.map(activity => (
//         <div key={activity.eduContentId} className={styles.activityCard}>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <div style={{ display: 'flex', gap: '8px' }}>
//               <span>{activity.eduContentId}</span>
//               <div>{activity.title}</div>
//             </div>
//             <Checkbox
//               checked={selectedActivities.has(activity.eduContentId!)}
//               onChange={() => handleActivitySelect(activity.eduContentId!)}
//             />
//           </div>
//           <div
//             style={{ maxWidth: '256px', height: '357px', position: 'relative' }}
//           >
//             <Image src={activity.thumbnailUrl!} alt="썸네일" fill />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
