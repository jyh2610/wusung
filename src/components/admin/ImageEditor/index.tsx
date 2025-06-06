'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ImageEditorProps,
  Rectangle,
  ImageSize,
  PREDEFINED_COORDINATES
} from './types';
import { ImagePreview } from './ImagePreview';
import { CoordinateList } from './CoordinateList';
import { EditModal } from './EditModal';
import { Input } from '@/components/ui/input';

export default function ImageEditor({
  image,
  coordinates,
  setCoordinates,
  handleImageUpload,
  imageIndex,
  existName,
  existMonth,
  existDay,
  existDayOfWeek,
  existElderName,
  setExistName,
  setExistMonth,
  setExistDay,
  setExistDayOfWeek,
  setExistElderName
}: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [originalCoordinates, setOriginalCoordinates] = useState<Rectangle[]>(
    []
  );
  const [selectedRectIndex, setSelectedRectIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        setImageSize({
          width: img.width * ratio,
          height: img.height * ratio
        });
      };
      img.src = image;
      setSelectedRectIndex(null);
      setOriginalCoordinates(coordinates[imageIndex] || []);
    } else {
      setImageSize(null);
      setOriginalCoordinates([]);
    }
  }, [image, imageIndex, coordinates]);

  const updateCoordinates = (newOriginal: Rectangle[]) => {
    setOriginalCoordinates(newOriginal);
    const newCoordinates = [...coordinates];
    newCoordinates[imageIndex] = newOriginal;
    setCoordinates(newCoordinates);
  };

  const handleToggleExist = (type: 'name' | 'date' | 'elderName') => {
    switch (type) {
      case 'name':
        setExistName(!existName);
        break;
      case 'date':
        setExistMonth(!existMonth);
        setExistDay(!existDay);
        setExistDayOfWeek(!existDayOfWeek);
        break;
      case 'elderName':
        setExistElderName(!existElderName);
        break;
    }
  };

  const handleAddCustomCoordinate = (rect: Rectangle, text: string) => {
    const newCoordinate: Rectangle = {
      ...rect,
      type: 'fixedText',
      fixedText: text,
      alignment: 'center'
    };

    const newCoordinates = [...coordinates];
    newCoordinates[imageIndex] = [
      ...(newCoordinates[imageIndex] || []),
      newCoordinate
    ];
    setCoordinates(newCoordinates);
    setCurrentRect(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || !imageSize || !isEditing) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > imageSize.width || y < 0 || y > imageSize.height) return;

    const xPercent = (x / imageSize.width) * 100;
    const yPercent = (y / imageSize.height) * 100;

    startRef.current = { x: xPercent, y: yPercent };
    setCurrentRect({ x: xPercent, y: yPercent, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startRef.current || !canvasRef.current || !imageSize || !isEditing)
      return;
    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = Math.max(0, Math.min(x, imageSize.width));
    const clampedY = Math.max(0, Math.min(y, imageSize.height));

    const xPercent = (clampedX / imageSize.width) * 100;
    const yPercent = (clampedY / imageSize.height) * 100;

    const yStart = startRef.current.y;
    const yEnd = yPercent;
    const top = Math.min(yStart, yEnd);
    const height = Math.abs(yStart - yEnd);

    setCurrentRect({
      x: Math.min(startRef.current.x, xPercent),
      y: top,
      width: Math.abs(startRef.current.x - xPercent),
      height: height
    });
  };

  const handleMouseUp = () => {
    if (!startRef.current || !currentRect || !imageSize || !isEditing) return;
    if (currentRect.width < 5 || currentRect.height < 5) {
      setCurrentRect(null);
      startRef.current = null;
      return;
    }
    startRef.current = null;
  };

  const deleteRectangle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOriginal = [...originalCoordinates];
    newOriginal.splice(index, 1);
    updateCoordinates(newOriginal);

    if (selectedRectIndex === index) setSelectedRectIndex(null);
    else if (selectedRectIndex && selectedRectIndex > index)
      setSelectedRectIndex(selectedRectIndex - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    e.target.value = '';
    handleImageUpload({
      target: { files }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!image ? (
        <Card>
          <CardContent className="p-4 flex flex-col items-center gap-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center w-full">
              <Upload className="w-8 h-8 text-muted mb-2" />
              <p className="text-sm mb-1">이미지를 업로드해주세요</p>
              <p className="text-xs text-muted">최대 100MB</p>
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                이미지 선택
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <ImagePreview
            image={image}
            imageSize={imageSize}
            originalCoordinates={originalCoordinates}
            selectedRectIndex={selectedRectIndex}
            onRectClick={setSelectedRectIndex}
          />

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4 mr-1" /> 좌표 추가
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              다른 이미지 업로드
            </Button>
          </div>

          <CoordinateList
            coordinates={originalCoordinates}
            selectedRectIndex={selectedRectIndex}
            onRectClick={setSelectedRectIndex}
            onDelete={deleteRectangle}
          />

          {isEditing && (
            <EditModal
              image={image}
              imageSize={imageSize}
              originalCoordinates={originalCoordinates}
              selectedRectIndex={selectedRectIndex}
              currentRect={currentRect}
              canvasRef={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onRectClick={setSelectedRectIndex}
              onToggleExist={handleToggleExist}
              onClose={() => setIsEditing(false)}
              existName={existName}
              existMonth={existMonth}
              existDay={existDay}
              existDayOfWeek={existDayOfWeek}
              existElderName={existElderName}
              onAddCustomCoordinate={handleAddCustomCoordinate}
            />
          )}
        </>
      )}
    </div>
  );
}
