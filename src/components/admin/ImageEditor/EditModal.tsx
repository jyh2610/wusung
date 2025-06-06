import { Rectangle, ImageSize, PREDEFINED_COORDINATES } from './types';
import { Button } from '@/components/ui/button';

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
    type: keyof typeof PREDEFINED_COORDINATES
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
  if (!imageSize) return null;

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
        <h2 className="text-lg font-bold mb-2">좌표 선택</h2>
        <p className="text-sm text-gray-500 mb-4">
          마우스로 영역을 드래그하여 선택하거나 아래 버튼을 사용하세요.
        </p>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => onAddPredefinedCoordinate('name')}
          >
            이름
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => onAddPredefinedCoordinate('date')}
          >
            날짜
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => onAddPredefinedCoordinate('difficulty')}
          >
            난이도
          </Button>
        </div>

        <div
          ref={canvasRef}
          className="relative border cursor-crosshair mx-auto"
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
