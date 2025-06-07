export interface IDashboard {
  announcementId: number;
  title: string;
  topExposure: boolean;
  topExposureTag: string;
  isVisible: boolean;
  views: number;
  updatedAt: string;
}

export interface RegDashboard {
  title: string;
  topExposure: boolean;
  topExposureTag: string;
  isVisible: boolean;
  content: string;
  files: File[];
}

export interface ResponseFile {
  announcement: string;
}

export interface UploadedFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
}

export interface DashboardDetail {
  announcementId: number;
  title: string;
  content: string;
  topExposure: boolean;
  topExposureTag: string;
  files: UploadedFile[];
  isVisible: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDashboardDTO {
  announcementRegisterDTO: {
    title: string;
    content: string;
    topExposure: boolean;
    topExposureTag: string;
    isVisible: boolean;
  };
  deletedFilesIdList: number[];
}
