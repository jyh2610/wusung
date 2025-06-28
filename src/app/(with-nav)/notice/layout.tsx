import { FloatingMenu } from '@/entities';
import { MenuList } from '@/entities/floatingMenu/const';
import { layoutContainer } from './layout.css';

const menuList: MenuList = {
  title: '공지 및 문의',
  subTitle: {
    dashboard: '공지사항',
    inquiry: '자주 묻는 질문',
    hwp: 'HWP',
    'personal-inquiry': '1:1문의'
  }
};

export default function NoticeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={layoutContainer}>
      <FloatingMenu menuList={menuList} />
      <div style={{ width: '888px' }}>{children}</div>
    </section>
  );
}
