import { Rectangle, ImageSize, PREDEFINED_COORDINATES } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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
  onAddPredefinedCoordinate: (
    type: keyof typeof PREDEFINED_COORDINATES,
    fixedText?: string
  ) => void;
  onClose: () => void;
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
  onAddPredefinedCoordinate,
  onClose
}: EditModalProps) => {
  const [selectedPreset, setSelectedPreset] = useState<
    keyof typeof PREDEFINED_COORDINATES | null
  >(null);
  const [fixedText, setFixedText] = useState('');

  useEffect(() => {
    console.log('EditModal 마운트됨');
  }, []);

  useEffect(() => {
    console.log('selectedPreset 변경:', selectedPreset);
  }, [selectedPreset]);

  useEffect(() => {
    console.log('fixedText 변경:', fixedText);
  }, [fixedText]);

  const handlePresetClick = (type: keyof typeof PREDEFINED_COORDINATES) => {
    console.log('handlePresetClick 실행:', type);
    if (type === 'name') {
      setSelectedPreset(type);
      setFixedText('');
    } else {
      onAddPredefinedCoordinate(type);
    }
  };

  const handleAddPreset = () => {
    console.log('handleAddPreset 실행');
    if (selectedPreset && fixedText.trim()) {
      onAddPredefinedCoordinate(selectedPreset, fixedText);
      setSelectedPreset(null);
      setFixedText('');
    }
  };

  if (!imageSize) {
    console.log('imageSize가 없음');
    return null;
  }

  console.log('렌더링 시점:', { selectedPreset, fixedText });

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
          <Button variant="ghost" onClick={onClose} className="text-gray-500">
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Button
              variant={selectedPreset === 'name' ? 'default' : 'outline'}
              type="button"
              onClick={() => handlePresetClick('name')}
            >
              이름
            </Button>
            {selectedPreset === 'name' && (
              <>
                <Input
                  type="text"
                  value={fixedText}
                  onChange={e => setFixedText(e.target.value)}
                  placeholder="이름을 입력하세요"
                  autoFocus
                  className="w-[200px]"
                />
                <Button onClick={handleAddPreset} disabled={!fixedText.trim()}>
                  확인
                </Button>
              </>
            )}
            <Button
              variant="outline"
              type="button"
              onClick={() => handlePresetClick('date')}
            >
              날짜
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handlePresetClick('difficulty')}
            >
              난이도
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
          onMouseUp={onMouseUp}
        >
          {originalCoordinates.map((rect, i) => (
            <div
              key={i}
              className={`absolute border-2 ${
                selectedRectIndex === i ? 'border-red-500' : 'border-blue-500'
              } bg-blue-400 bg-opacity-20`}
              style={{
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`
              }}
              onClick={() => onRectClick(i)}
            />
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

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="bg-blue-500 text-white">
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
