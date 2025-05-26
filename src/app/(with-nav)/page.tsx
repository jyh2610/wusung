import { MainBanner, LineBanner, MainSection } from '@/entities';
import { MainStyles } from './style.css';
import { FloatingBar } from '@/entities/MainBanner/ui/FloatingBar';

export default function Home() {
  return (
    <main className={MainStyles}>
      <section>
        <MainBanner />
        <LineBanner />
      </section>
      <MainSection />
      <FloatingBar />
    </main>
  );
}
