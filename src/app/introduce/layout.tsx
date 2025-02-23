import { FloatingMenu } from '@/entities';
import { layoutContainer } from './layout.css';

export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={layoutContainer}>
      <FloatingMenu />
      {children}
    </section>
  );
}
