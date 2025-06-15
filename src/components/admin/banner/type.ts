export type BannerCategory = 'slide_banner' | 'story_banner';
export interface IMainBannerResponse {
  type: 'slide_banner' | 'story_banner';
  displayOrder: number;
  url: string;
}
export interface IBannerResponse {
  bannerId: number;
  type: BannerCategory;
  displayOrder: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBannerRegisterDTO {
  type: BannerCategory;
  displayOrder: number;
}
