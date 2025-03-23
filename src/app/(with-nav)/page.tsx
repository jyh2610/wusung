import { MainBanner, LineBanner, MainSection } from '@/entities';
import { MainStyles } from './style.css';

export default function Home() {
  return (
    <main className={MainStyles}>
      <section>
        <MainBanner />
        <LineBanner />
      </section>
      <MainSection />
    </main>
  );
}
