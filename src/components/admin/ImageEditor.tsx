'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageEditorProps {
  image: string;
  coordinates: Rectangle[];
  setCoordinates: (coordinates: Rectangle[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageEditor({
  image,
  coordinates,
  setCoordinates,
  handleImageUpload
}: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
    null
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  // 화면에서 표시할 원본 좌표 저장 (PDF 변환 전)
  const [originalCoordinates, setOriginalCoordinates] = useState<Rectangle[]>(
    []
  );

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = image;
      setSelectedRectIndex(null);
    } else {
      setImageSize(null);
      setOriginalCoordinates([]);
    }
  }, [image]);

  const convertToPDFCoordinates = (rect: Rectangle) => {
    return {
      x: (rect.x / imageSize!.width) * 100,
      y: 100 - ((rect.y + rect.height) / imageSize!.height) * 100,
      width: (rect.width / imageSize!.width) * 100,
      height: (rect.height / imageSize!.height) * 100
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image || !canvasRef.current || !isEditing || !imageSize) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    startRef.current = { x: startX, y: startY };
    setCurrentRect({ x: startX, y: startY, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startRef.current || !canvasRef.current || !isEditing || !imageSize)
      return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    setCurrentRect({
      x: Math.min(startRef.current.x, endX),
      y: Math.min(startRef.current.y, endY),
      width: Math.abs(startRef.current.x - endX),
      height: Math.abs(startRef.current.y - endY)
    });
  };

  const handleMouseUp = () => {
    if (!startRef.current || !currentRect || !isEditing || !imageSize) return;

    if (currentRect.width < 5 || currentRect.height < 5) {
      startRef.current = null;
      setCurrentRect(null);
      return;
    }

    // 원본 좌표 저장 (픽셀 단위)
    setOriginalCoordinates([...originalCoordinates, currentRect]);

    // 변환된 좌표 저장 (상위 컴포넌트 전달)
    const pdfRect = convertToPDFCoordinates(currentRect);
    setCoordinates([...coordinates, pdfRect]);

    setSelectedRectIndex(originalCoordinates.length);
    startRef.current = null;
    setCurrentRect(null);
  };

  const deleteRectangle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOriginalCoordinates = [...originalCoordinates];
    const newCoordinates = [...coordinates];
    newOriginalCoordinates.splice(index, 1);
    newCoordinates.splice(index, 1);

    setOriginalCoordinates(newOriginalCoordinates);
    setCoordinates(newCoordinates);

    if (selectedRectIndex === index) {
      setSelectedRectIndex(null);
    } else if (selectedRectIndex !== null && selectedRectIndex > index) {
      setSelectedRectIndex(selectedRectIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {!image ? (
        <div className="grid gap-3 w-full">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center gap-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center flex flex-col items-center gap-4 w-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    파일을 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    최대 파일 크기: 100MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  파일 선택
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="relative w-full max-h-[400px] overflow-hidden flex justify-center">
            <div className="relative">
              <img
                src={image}
                alt="미리보기"
                className="max-w-full max-h-[400px] object-contain"
              />

              {originalCoordinates.map((rect, index) => (
                <div
                  key={index}
                  className={`absolute border-2 ${selectedRectIndex === index ? 'border-red-500' : 'border-blue-500'} bg-blue-300 bg-opacity-30 cursor-pointer`}
                  style={{
                    left: `${(rect.x / imageSize!.width) * 100}%`,
                    top: `${(rect.y / imageSize!.height) * 100}%`,
                    width: `${(rect.width / imageSize!.width) * 100}%`,
                    height: `${(rect.height / imageSize!.height) * 100}%`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              onClick={() => setIsEditing(true)} // 상태 변경
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              <Plus size={16} className="mr-1" /> 좌표 추가
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              추가 이미지 업로드
            </Button>
          </div>
          {isEditing && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
              <div className="relative bg-white p-4 rounded shadow-lg">
                <h3 className="text-lg font-bold">좌표 추가</h3>
                <p className="text-sm text-gray-500 mb-4">
                  이미지를 클릭하고 드래그하여 영역을 선택하세요.
                </p>

                {/* 좌표 선택 영역 */}
                <div
                  ref={canvasRef}
                  className="relative border cursor-crosshair"
                  style={{
                    width: imageSize?.width || 400,
                    height: imageSize?.height || 300,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  {/* 기존 좌표 */}
                  {originalCoordinates.map((rect, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30"
                      style={{
                        left: `${(rect.x / imageSize!.width) * 100}%`,
                        top: `${(rect.y / imageSize!.height) * 100}%`,
                        width: `${(rect.width / imageSize!.width) * 100}%`,
                        height: `${(rect.height / imageSize!.height) * 100}%`
                      }}
                    />
                  ))}

                  {/* 현재 그리고 있는 좌표 */}
                  {currentRect && (
                    <div
                      className="absolute border-2 border-red-500 bg-red-300 bg-opacity-30"
                      style={{
                        left: `${(currentRect.x / imageSize!.width) * 100}%`,
                        top: `${(currentRect.y / imageSize!.height) * 100}%`,
                        width: `${(currentRect.width / imageSize!.width) * 100}%`,
                        height: `${(currentRect.height / imageSize!.height) * 100}%`
                      }}
                    />
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    확인
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 w-full border rounded-md p-3">
            <h3 className="text-sm font-bold mb-2">
              선택된 좌표 목록 ({originalCoordinates.length}개)
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {originalCoordinates.map((rect, index) => (
                <div
                  key={index}
                  className="p-2 border rounded-md flex justify-between items-center cursor-pointer"
                >
                  <div className="text-xs">
                    좌표 {index + 1}: X {rect.x}, Y {rect.y}, W {rect.width}, H{' '}
                    {rect.height}
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500"
                    onClick={e => deleteRectangle(index, e)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
