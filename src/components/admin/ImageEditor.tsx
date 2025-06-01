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
  coordinates: Rectangle[]; // 1차원 배열
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
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
    null
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  // 이미지가 변경될 때마다 이미지 크기 설정
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
      };
      img.src = image;
      setSelectedRectIndex(null);
    } else {
      setImageSize(null);
    }
  }, [image]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image || !canvasRef.current || !isEditing || !imageSize) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / scale;
    const startY = (e.clientY - rect.top) / scale;
    startRef.current = { x: startX, y: startY };
    setCurrentRect({ x: startX, y: startY, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startRef.current || !canvasRef.current || !isEditing || !imageSize)
      return;
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = (e.clientX - rect.left) / scale;
    const endY = (e.clientY - rect.top) / scale;
    setCurrentRect({
      x: Math.min(startRef.current.x, endX),
      y: Math.min(startRef.current.y, endY),
      width: Math.abs(startRef.current.x - endX),
      height: Math.abs(startRef.current.y - endY)
    });
  };

  const handleMouseUp = () => {
    if (!startRef.current || !currentRect || !isEditing || !imageSize) return;

    // 최소 크기 검사 (너무 작은 좌표 영역은 무시)
    if (
      currentRect.width === undefined ||
      currentRect.height === undefined ||
      currentRect.x === undefined ||
      currentRect.y === undefined ||
      currentRect.width < 5 ||
      currentRect.height < 5
    ) {
      startRef.current = null;
      setCurrentRect(null);
      return;
    }

    // 좌표값이 모두 유효할 때만 저장
    const newRect = {
      x: (currentRect.x / imageSize.width) * 100,
      y: (currentRect.y / imageSize.height) * 100,
      width: (currentRect.width / imageSize.width) * 100,
      height: (currentRect.height / imageSize.height) * 100
    };

    if (
      isNaN(newRect.x) ||
      isNaN(newRect.y) ||
      isNaN(newRect.width) ||
      isNaN(newRect.height)
    ) {
      startRef.current = null;
      setCurrentRect(null);
      return;
    }

    setCoordinates([...coordinates, newRect]);
    setSelectedRectIndex(coordinates.length);

    startRef.current = null;
    setCurrentRect(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale + e.deltaY * -0.001, 0.5), 3);
    setScale(newScale);
  };

  const handleComplete = () => {
    setIsEditing(false);
  };

  const selectRectangle = (index: number) => {
    setSelectedRectIndex(index);
  };

  const deleteRectangle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCoordinates = [...coordinates];
    newCoordinates.splice(index, 1);
    setCoordinates(newCoordinates);

    if (selectedRectIndex === index) {
      setSelectedRectIndex(null);
    } else if (selectedRectIndex !== null && selectedRectIndex > index) {
      setSelectedRectIndex(selectedRectIndex - 1);
    }
  };

  console.log(coordinates);

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
                  id="file"
                  type="file"
                  accept="image/*"
                  multiple
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
              {coordinates.map((rect, index) => (
                <div
                  key={index}
                  className={`absolute border-2 ${
                    selectedRectIndex === index
                      ? 'border-red-500'
                      : 'border-blue-500'
                  } bg-blue-300 bg-opacity-30 cursor-pointer`}
                  style={{
                    left: `${rect.x}%`,
                    top: `${rect.y}%`,
                    width: `${rect.width}%`,
                    height: `${rect.height}%`
                  }}
                  onClick={() => selectRectangle(index)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus size={16} className="mr-1" /> 좌표 추가
            </Button>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              추가 이미지 업로드
            </Button>
          </div>

          {/* 좌표 목록 */}
          {coordinates.length > 0 && (
            <div className="mt-4 w-full border rounded-md p-3">
              <h3 className="text-sm font-bold mb-2">
                선택된 좌표 목록 ({coordinates.length}개)
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {coordinates.map((rect, index) => (
                  <div
                    key={index}
                    className={`p-2 border rounded-md flex justify-between items-center cursor-pointer ${
                      selectedRectIndex === index
                        ? 'bg-blue-50 border-blue-500'
                        : ''
                    }`}
                    onClick={() => selectRectangle(index)}
                  >
                    <div className="text-xs">
                      <span className="font-semibold">좌표 {index + 1}:</span>
                      X: {rect.x?.toFixed(2)}%, Y: {rect.y?.toFixed(2)}%, W:{' '}
                      {rect.width?.toFixed(2)}%, H: {rect.height?.toFixed(2)}%
                    </div>
                    <Button
                      variant="ghost"
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
          )}
        </>
      )}

      {isEditing && image && imageSize && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative border bg-white shadow-lg p-4 flex flex-col items-center max-w-[90vw] max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-2">좌표 영역 선택</h3>
            <p className="text-sm text-gray-500 mb-4">
              이미지를 클릭하고 드래그하여 영역을 선택하세요
            </p>

            <div
              ref={canvasRef}
              className="relative border mb-4 cursor-crosshair"
              style={{
                width: imageSize.width * scale,
                height: imageSize.height * scale,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* 기존 좌표 표시 */}
              {coordinates.map((rect, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-blue-500 bg-blue-300 bg-opacity-30"
                  style={{
                    left: `${rect.x}%`,
                    top: `${rect.y}%`,
                    width: `${rect.width}%`,
                    height: `${rect.height}%`
                  }}
                />
              ))}

              {/* 현재 그리고 있는 좌표 */}
              {currentRect && (
                <div
                  className="absolute border-2 border-red-500 bg-red-300 bg-opacity-30"
                  style={{
                    left: `${(currentRect.x / imageSize.width) * 100}%`,
                    top: `${(currentRect.y / imageSize.height) * 100}%`,
                    width: `${(currentRect.width / imageSize.width) * 100}%`,
                    height: `${(currentRect.height / imageSize.height) * 100}%`
                  }}
                />
              )}
            </div>

            <div className="flex gap-4 w-full">
              <Button
                onClick={handleComplete}
                className="bg-green-500 text-white px-4 py-2 rounded flex-1"
              >
                완료
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
