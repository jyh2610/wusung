export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fileIndex?: number;
  type?: string;
  fixedText?: string;
  alignment?: string;
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
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export interface IContent {
  existName: boolean[];
  existMonth: boolean[];
  existDay: boolean[];
  existDayOfWeek: boolean[];
  existElderName: boolean[];
}

export const PREDEFINED_COORDINATES = {
  name: { x: 10, y: 10, width: 80, height: 20 },
  date: { x: 10, y: 40, width: 80, height: 20 },
  elderName: { x: 10, y: 70, width: 80, height: 20 }
};
