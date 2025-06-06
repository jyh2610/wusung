import { Rectangle } from './types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CoordinateListProps {
  coordinates: Rectangle[];
  selectedRectIndex: number | null;
  onRectClick: (index: number) => void;
  onDelete: (index: number, e: React.MouseEvent) => void;
}

export const CoordinateList = ({
  coordinates,
  selectedRectIndex,
  onRectClick,
  onDelete
}: CoordinateListProps) => {
  return (
    <div className="mt-4 space-y-2 max-h-[180px] overflow-auto border rounded p-2">
      {coordinates.map((rect, i) => (
        <div
          key={i}
          className="flex justify-between items-center text-sm p-1 border rounded"
          onClick={() => onRectClick(i)}
        >
          <span>
            #{i + 1} X:{rect.x}, Y:{rect.y}, W:{rect.width}, H:{rect.height}
          </span>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="text-red-500"
            onClick={e => onDelete(i, e)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
