// // features/activity/ui/components/ActivityHeader.tsx
// import React from 'react';
// import { Button } from '@/shared/ui';
// import { MenuItem, OutlinedInput } from '@mui/material';
// import { Select } from '@/components/ui/select';

// export function ActivityHeader({
//   selectedCategoryNode,
//   categories,
//   personName,
//   handleCategoryChange,
//   handleSelectAll,
//   handleDeselectAll,
//   handlePrint
// }) {
//   const MenuProps = {
//     PaperProps: { style: { width: 250 } }
//   };

//   return (
//     <div className={styles.titleContainer}>
//       <div style={{ display: 'flex' }}>
//         <div style={{ fontSize: '32px', fontWeight: 600, marginRight: '16px' }}>
//           {selectedCategoryNode?.name || '카테고리 선택'}
//         </div>
//         <Select
//           displayEmpty
//           value={personName}
//           onChange={handleCategoryChange}
//           input={<OutlinedInput />}
//           sx={{ width: '240px', height: '50px' }}
//           renderValue={selected =>
//             selected.length === 0 ? <em>선택</em> : selected.join(', ')
//           }
//           MenuProps={MenuProps}
//           inputProps={{ 'aria-label': 'Without label' }}
//         >
//           <MenuItem disabled value="">
//             <em>선택</em>
//           </MenuItem>
//           {categories?.map(name => (
//             <MenuItem key={name.categoryId} value={name.name}>
//               {name.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//         <Button
//           content="전체 선택"
//           onClick={handleSelectAll}
//           type="borderBrand"
//         />
//         <Button
//           content="전체 해제"
//           onClick={handleDeselectAll}
//           type="borderBrand"
//         />
//         <Button content="인쇄" onClick={handlePrint} type="brand" />
//       </div>
//     </div>
//   );
// }
