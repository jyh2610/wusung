export interface IPopup {
  popupId: number;
  title: string;
  content: string;
  positionCode: string;
  isActive: boolean;
  priority: number;
  startTime: string;
  endTime: string;
}

export interface IRegPopup {
  title: string;
  content: string;
  positionCode: string;
  isActive: boolean;
  priority: number;
  startTime: string;
  endTime: string;
}

export interface ResponseFile {
  popup: string;
}
