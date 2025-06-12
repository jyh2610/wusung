import { MainBanner, LineBanner, MainSection } from '@/entities';
import { MainStyles } from './style.css';
import { FloatingBar } from '@/entities/MainBanner/ui/FloatingBar';
import { NoticePopupWrapper } from '@/components/NoticePopupWrapper';

export default function Home() {
  return (
    <main className={MainStyles}>
      <NoticePopupWrapper />
      <section>
        <MainBanner />
        <LineBanner />
      </section>
      <MainSection />
      <FloatingBar />
    </main>
  );
}
