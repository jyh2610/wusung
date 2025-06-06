export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
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
