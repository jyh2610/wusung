// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Plus, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Rectangle } from './tpye';

// interface ImageEditorProps {
//   image: string;
//   coordinates: Rectangle[][];
//   setCoordinates: (coordinates: Rectangle[][]) => void;
//   handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   imageIndex: number;
// }

// interface ImageSize {
//   width: number;
//   height: number;
// }

// const PREDEFINED_COORDINATES = {
//   name: {
//     x: 248.48782348632812,
//     y: 8.116302490234375,
//     width: 170,
//     height: 22
//   },
//   date: {
//     x: 60.340240478515625,
//     y: 8.116302490234375,
//     width: 135,
//     height: 23
//   },
//   difficulty: {
//     x: 62.340240478515625,
//     y: 56.116302490234375,
//     width: 133,
//     height: 30
//   }
// } as const;

// export default function ImageEditor({
//   image,
//   coordinates,
//   setCoordinates,
//   handleImageUpload,
//   imageIndex
// }: ImageEditorProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const startRef = useRef<{ x: number; y: number } | null>(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
//   const [imageSize, setImageSize] = useState<ImageSize | null>(null);
//   const [originalCoordinates, setOriginalCoordinates] = useState<Rectangle[]>(
//     []
//   );
//   const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
//     null
//   );

//   useEffect(() => {
//     if (image) {
//       const img = new Image();
//       img.onload = () => {
//         const maxWidth = 800;
//         const maxHeight = 600;
//         const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
//         setImageSize({
//           width: img.width * ratio,
//           height: img.height * ratio
//         });
//       };
//       img.src = image;
//       setSelectedRectIndex(null);
//       setOriginalCoordinates(coordinates[imageIndex] || []);
//     } else {
//       setImageSize(null);
//       setOriginalCoordinates([]);
//     }
//   }, [image, imageIndex, coordinates]);

//   const updateCoordinates = (newOriginal: Rectangle[]) => {
//     setOriginalCoordinates(newOriginal);
//     const newCoordinates = [...coordinates];
//     newCoordinates[imageIndex] = newOriginal;
//     setCoordinates(newCoordinates);
//   };

//   const addPredefinedCoordinate = (
//     type: keyof typeof PREDEFINED_COORDINATES
//   ) => {
//     if (!imageSize) return;

//     const newOriginal = [...originalCoordinates, PREDEFINED_COORDINATES[type]];
//     updateCoordinates(newOriginal);
//     setSelectedRectIndex(newOriginal.length - 1);
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!canvasRef.current || !imageSize || !isEditing) return;
//     const rect = canvasRef.current.getBoundingClientRect();

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     if (x < 0 || x > imageSize.width || y < 0 || y > imageSize.height) return;

//     startRef.current = { x, y };
//     setCurrentRect({ x, y, width: 0, height: 0 });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!startRef.current || !canvasRef.current || !imageSize || !isEditing)
//       return;
//     const rect = canvasRef.current.getBoundingClientRect();

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const clampedX = Math.max(0, Math.min(x, imageSize.width));
//     const clampedY = Math.max(0, Math.min(y, imageSize.height));

//     setCurrentRect({
//       x: Math.min(startRef.current.x, clampedX),
//       y: Math.min(startRef.current.y, clampedY),
//       width: Math.abs(startRef.current.x - clampedX),
//       height: Math.abs(startRef.current.y - clampedY)
//     });
//   };

//   const handleMouseUp = () => {
//     if (!startRef.current || !currentRect || !imageSize || !isEditing) return;
//     if (currentRect.width < 5 || currentRect.height < 5) {
//       setCurrentRect(null);
//       startRef.current = null;
//       return;
//     }

//     const newOriginal = [...originalCoordinates, currentRect];
//     updateCoordinates(newOriginal);
//     setSelectedRectIndex(newOriginal.length - 1);
//     setCurrentRect(null);
//     startRef.current = null;
//   };

//   const deleteRectangle = (index: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const newOriginal = [...originalCoordinates];
//     newOriginal.splice(index, 1);
//     updateCoordinates(newOriginal);

//     if (selectedRectIndex === index) setSelectedRectIndex(null);
//     else if (selectedRectIndex && selectedRectIndex > index)
//       setSelectedRectIndex(selectedRectIndex - 1);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files ? Array.from(e.target.files) : [];
//     if (files.length === 0) return;
//     e.target.value = '';
//     handleImageUpload({
//       target: { files }
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   const renderImagePreview = () => (
//     <div
//       className="relative border rounded overflow-hidden"
//       style={{
//         width: `${imageSize?.width}px`,
//         height: `${imageSize?.height}px`,
//         margin: '0 auto',
//         position: 'relative'
//       }}
//     >
//       <img
//         src={image}
//         alt="미리보기"
//         style={{
//           width: `${imageSize?.width}px`,
//           height: `${imageSize?.height}px`,
//           objectFit: 'contain',
//           display: 'block'
//         }}
//       />
//       {originalCoordinates.map((rect, i) => (
//         <div
//           key={i}
//           onClick={() => setSelectedRectIndex(i)}
//           className={`absolute border-2 ${
//             selectedRectIndex === i ? 'border-red-500' : 'border-blue-500'
//           } bg-blue-400 bg-opacity-20`}
//           style={{
//             left: `${rect.x}px`,
//             top: `${rect.y}px`,
//             width: `${rect.width}px`,
//             height: `${rect.height}px`
//           }}
//         />
//       ))}
//     </div>
//   );

//   const renderCoordinateList = () => (
//     <div className="mt-4 space-y-2 max-h-[180px] overflow-auto border rounded p-2">
//       {originalCoordinates.map((rect, i) => (
//         <div
//           key={i}
//           className="flex justify-between items-center text-sm p-1 border rounded"
//           onClick={() => setSelectedRectIndex(i)}
//         >
//           <span>
//             #{i + 1} X:{rect.x}, Y:{rect.y}, W:{rect.width}, H:{rect.height}
//           </span>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-red-500"
//             onClick={e => deleteRectangle(i, e)}
//           >
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       ))}
//     </div>
//   );

//   const renderEditModal = () => (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
//       <div
//         className="bg-white rounded-lg shadow-xl p-6 relative"
//         style={{
//           width: '90vw',
//           maxWidth: '1200px',
//           height: 'auto',
//           maxHeight: '90vh'
//         }}
//       >
//         <h2 className="text-lg font-bold mb-2">좌표 선택</h2>
//         <p className="text-sm text-gray-500 mb-4">
//           마우스로 영역을 드래그하여 선택하거나 아래 버튼을 사용하세요.
//         </p>

//         <div className="flex gap-2 mb-4">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => addPredefinedCoordinate('name')}
//           >
//             이름
//           </Button>
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => addPredefinedCoordinate('date')}
//           >
//             날짜
//           </Button>
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => addPredefinedCoordinate('difficulty')}
//           >
//             난이도
//           </Button>
//         </div>

//         <div
//           ref={canvasRef}
//           className="relative border cursor-crosshair mx-auto"
//           style={{
//             width: `${imageSize?.width}px`,
//             height: `${imageSize?.height}px`,
//             maxWidth: '100%',
//             maxHeight: 'calc(90vh - 200px)',
//             backgroundImage: `url(${image})`,
//             backgroundSize: 'contain',
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: 'center'
//           }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//         >
//           {originalCoordinates.map((rect, i) => (
//             <div
//               key={i}
//               className={`absolute border-2 ${
//                 selectedRectIndex === i ? 'border-red-500' : 'border-blue-500'
//               } bg-blue-400 bg-opacity-20`}
//               style={{
//                 left: `${rect.x}px`,
//                 top: `${rect.y}px`,
//                 width: `${rect.width}px`,
//                 height: `${rect.height}px`
//               }}
//             />
//           ))}

//           {currentRect && (
//             <div
//               className="absolute border-2 border-red-500 bg-red-300 bg-opacity-30"
//               style={{
//                 left: `${currentRect.x}px`,
//                 top: `${currentRect.y}px`,
//                 width: `${currentRect.width}px`,
//                 height: `${currentRect.height}px`
//               }}
//             />
//           )}
//         </div>

//         <div className="flex justify-end mt-4">
//           <Button
//             onClick={() => setIsEditing(false)}
//             className="bg-blue-500 text-white"
//           >
//             확인
//           </Button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full">
//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         accept="image/*"
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       {!image ? (
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center gap-4">
//             <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center w-full">
//               <Upload className="w-8 h-8 text-muted mb-2" />
//               <p className="text-sm mb-1">이미지를 업로드해주세요</p>
//               <p className="text-xs text-muted">최대 100MB</p>
//               <Button
//                 variant="outline"
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 이미지 선택
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           {renderImagePreview()}

//           <div className="flex gap-2 mt-4">
//             <Button onClick={() => setIsEditing(true)}>
//               <Plus className="w-4 h-4 mr-1" /> 좌표 추가
//             </Button>
//             <Button
//               variant="outline"
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               다른 이미지 업로드
//             </Button>
//           </div>

//           {renderCoordinateList()}
//           {isEditing && renderEditModal()}
//         </>
//       )}
//     </div>
//   );
// }
