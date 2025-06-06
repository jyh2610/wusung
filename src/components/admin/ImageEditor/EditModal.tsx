import { Rectangle, ImageSize } from './types';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
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
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={handleMouseUp}
        >
          {originalCoordinates.map((rect, i) => (
            <div key={i} className="relative">
              <div
                className={`absolute border-2 ${
                  selectedRectIndex === i ? 'border-red-500' : 'border-blue-500'
                } bg-blue-400 bg-opacity-20`}
                style={{
                  left: `${rect.x}px`,
                  top: `${rect.y}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`
                }}
                onClick={() => handleRectClick(i)}
              />
              {rect.fixedText && (
                <div
                  className="absolute bg-white px-2 py-1 rounded text-sm shadow-sm"
                  style={{
                    left: `${rect.x + rect.width + 5}px`,
                    top: `${rect.y}px`
                  }}
                >
                  텍스트: {rect.fixedText}
                </div>
              )}
            </div>
          ))}

          {currentRect && (
            <div
              className="absolute border-2 border-red-500 bg-red-300 bg-opacity-30"
              style={{
                left: `${currentRect.x}px`,
                top: `${currentRect.y}px`,
                width: `${currentRect.width}px`,
                height: `${currentRect.height}px`
              }}
            />
          )}
        </div>

        {selectedRect && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">좌표 정보</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">X: {selectedRect.x}px</p>
                <p className="text-sm text-gray-500">Y: {selectedRect.y}px</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  너비: {selectedRect.width}px
                </p>
                <p className="text-sm text-gray-500">
                  높이: {selectedRect.height}px
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
