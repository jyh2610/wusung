import { Rectangle, ImageSize } from './types';

interface ImagePreviewProps {
  image: string;
  imageSize: ImageSize | null;
  originalCoordinates: Rectangle[];
  selectedRectIndex: number | null;
  onRectClick: (index: number) => void;
}

export const ImagePreview = ({
  image,
  imageSize,
  originalCoordinates,
  selectedRectIndex,
  onRectClick
}: ImagePreviewProps) => {
  if (!imageSize) return null;

  return (
    <div
      className="relative border rounded overflow-hidden"
      style={{
        width: `${imageSize.width}px`,
        height: `${imageSize.height}px`,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <img
        src={image}
        alt="미리보기"
        style={{
          width: `${imageSize.width}px`,
          height: `${imageSize.height}px`,
          objectFit: 'contain',
          display: 'block'
        }}
      />
      {originalCoordinates.map((rect, i) => (
        <div
          key={i}
          onClick={() => onRectClick(i)}
          className={`absolute border-2 ${
            selectedRectIndex === i ? 'border-red-500' : 'border-blue-500'
          } bg-blue-400 bg-opacity-20`}
          style={{
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
          }}
        />
      ))}
    </div>
  );
};
