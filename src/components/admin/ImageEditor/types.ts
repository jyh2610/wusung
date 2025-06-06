export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'fixedText';
  fixedText?: string;
  alignment?: 'left' | 'center' | 'right';
  existName?: boolean;
  existMonth?: boolean;
  existDay?: boolean;
  existDayOfWeek?: boolean;
  existElderName?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageEditorProps {
  image: string;
  coordinates: Rectangle[][];
  setCoordinates: (coordinates: Rectangle[][]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageIndex: number;
  existName: boolean;
  existMonth: boolean;
  existDay: boolean;
  existDayOfWeek: boolean;
  existElderName: boolean;
  setExistName: (value: boolean) => void;
  setExistMonth: (value: boolean) => void;
  setExistDay: (value: boolean) => void;
  setExistDayOfWeek: (value: boolean) => void;
  setExistElderName: (value: boolean) => void;
}

export const PREDEFINED_COORDINATES = {
  name: {
    x: 248.48782348632812,
    y: 8.116302490234375,
    width: 170,
    height: 22
  },
  date: {
    x: 60.340240478515625,
    y: 8.116302490234375,
    width: 135,
    height: 23
  },
  difficulty: {
    x: 62.340240478515625,
    y: 56.116302490234375,
    width: 133,
    height: 30
  }
} as const;
