import { FloatingMenu } from '@/entities';
import { MenuList } from '@/entities/floatingMenu/const';
import { layoutContainer } from './layout.css';

export const menuList: MenuList = {
  title: '우성인지펜 소개',
  subTitle: {
    greeting: '인사말',
    map: '오시는길'
  }
};

export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={layoutContainer}>
      <FloatingMenu menuList={menuList} />
      {children}
    </section>
  );
}
