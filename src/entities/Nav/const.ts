export const NavLists = ['우성인지펜 소개', '요금안내', '공지사항', '소개'];

export interface INaviList {
  title: string;
  subTitle: string[];
}
export const navLists: INaviList[] = [
  {
    title: '우성인지펜 소개',
    subTitle: ['인사말', '오시는길']
  },
  {
    title: '요금안내',
    subTitle: ['요금 안내 및 결제']
  },
  {
    title: '공지사항',
    subTitle: ['공지사항', '한글 다운로드']
  },
  {
    title: '마이페이지',
    subTitle: ['결제내역', '문의내역']
  }
];
