import { Rectangle, ImageSize } from './types';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface EditModalProps {
  image: string;
  imageSize: ImageSize | null;
  originalCoordinates: Rectangle[];
  selectedRectIndex: number | null;
  currentRect: Rectangle | null;
  canvasRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onRectClick: (index: number) => void;
  onToggleExist: (type: 'name' | 'date' | 'elderName') => void;
  onClose: () => void;
  existName: boolean;
  existMonth: boolean;
  existDay: boolean;
  existDayOfWeek: boolean;
  existElderName: boolean;
  onAddCustomCoordinate: (rect: Rectangle, text: string) => void;
}

export const EditModal = ({
  image,
  imageSize,
  originalCoordinates,
  selectedRectIndex,
  currentRect,
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onRectClick,
  onToggleExist,
  onClose,
  existName,
  existMonth,
  existDay,
  existDayOfWeek,
  existElderName,
  onAddCustomCoordinate
}: EditModalProps) => {
  const [selectedPreset, setSelectedPreset] = useState<
    'name' | 'date' | 'elderName' | null
  >(null);
  const [customText, setCustomText] = useState('');
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgRect, setImgRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (imgRef.current && imageSize) {
      const containerW = imageSize.width;
      const containerH = imageSize.height;
      const img = imgRef.current;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const ratio = Math.min(containerW / naturalW, containerH / naturalH);
      const displayW = naturalW * ratio;
      const displayH = naturalH * ratio;
      setImgRect({
        left: (containerW - displayW) / 2,
        top: (containerH - displayH) / 2,
        width: displayW,
        height: displayH
      });
    }
  }, [image, imageSize]);

  useEffect(() => {
    if (currentRect && currentRect.width > 5 && currentRect.height > 5) {
      setSelectedRect(currentRect);
      setCustomText('');
    }
  }, [currentRect]);

  const handlePresetClick = (type: 'name' | 'date' | 'elderName') => {
    console.log('handlePresetClick 실행:', type);
    setSelectedPreset(type);
    onToggleExist(type);
  };

  const handleMouseUp = () => {
    onMouseUp();
  };

  const handleRectClick = (index: number) => {
    onRectClick(index);
    setSelectedRect(originalCoordinates[index]);
    setCustomText(originalCoordinates[index].fixedText || '');
  };

  const handleAddCustomText = () => {
    if (selectedRect && customText) {
      onAddCustomCoordinate(
        { ...selectedRect, fixedText: customText },
        customText
      );
      setCustomText('');
      setSelectedRect(null);
    }
  };

  if (!imageSize) {
    console.log('imageSize가 없음');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg shadow-xl p-6 relative"
        style={{
          width: '90vw',
          maxWidth: '1200px',
          height: 'auto',
          maxHeight: '90vh'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">좌표 편집</h2>
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Button
              variant={existName ? 'default' : 'outline'}
              type="button"
              onClick={() => handlePresetClick('name')}
              className={existName ? 'bg-blue-500 text-white' : ''}
            >
              이름
            </Button>
            <Button
              variant={
                existMonth || existDay || existDayOfWeek ? 'default' : 'outline'
              }
              type="button"
              onClick={() => handlePresetClick('date')}
              className={
                existMonth || existDay || existDayOfWeek
                  ? 'bg-blue-500 text-white'
                  : ''
              }
            >
              날짜
            </Button>
            <Button
              variant={existElderName ? 'default' : 'outline'}
              type="button"
              onClick={() => handlePresetClick('elderName')}
              className={existElderName ? 'bg-blue-500 text-white' : ''}
            >
              대상자명
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            마우스로 영역을 드래그하여 선택하거나 위 버튼을 사용하세요.
          </p>
        </div>

        <div
          ref={canvasRef}
          className="relative border cursor-crosshair mx-auto mt-4"
          style={{
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            maxWidth: '100%',
            maxHeight: 'calc(90vh - 200px)',
            position: 'relative'
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={image}
            alt="편집 이미지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 0
            }}
            onLoad={() => {
              // 위 useEffect에서 계산됨
            }}
          />
          {originalCoordinates.map((rect, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${imgRect.left + (rect.x / 100) * imgRect.width}px`,
                top: `${imgRect.top + (rect.y / 100) * imgRect.height}px`,
                width: `${(rect.width / 100) * imgRect.width}px`,
                height: `${(rect.height / 100) * imgRect.height}px`,
                border: '2px solid red',
                background: 'rgba(255,0,0,0.2)',
                zIndex: 1
              }}
              onClick={() => handleRectClick(i)}
            />
          ))}

          {currentRect && (
            <div
              className="absolute border-2 border-red-500 bg-red-300 bg-opacity-30"
              style={{
                left: `${currentRect.x}%`,
                top: `${currentRect.y}%`,
                width: `${currentRect.width}%`,
                height: `${currentRect.height}%`
              }}
            />
          )}
        </div>

        {selectedRect && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">좌표 정보</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  X: {selectedRect.x.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  Y: {selectedRect.y.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  너비: {selectedRect.width.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  높이: {selectedRect.height.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="표시할 텍스트를 입력하세요"
                className="flex-1"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <Button
            type="button"
            onClick={handleAddCustomText}
            disabled={!selectedRect || !customText}
            className="bg-blue-500 text-white"
          >
            좌표 추가
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800"
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};
