export interface IOverlay {
  fileIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alignment: string;
  type: string;
  fixedText: string;
}

export interface IContent {
  title: string;
  difficultyLevel: number;
  categoryId: number;
  year: number;
  month: number;
  description?: string;
  isUsed?: boolean;
  overlays?: IOverlay[];
}
