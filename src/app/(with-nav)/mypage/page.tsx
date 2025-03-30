import { MypageComponent } from '@/entities/mypage';
import { layoutContainer } from '../introduce/layout.css';

function Mypage() {
  return (
    <main className={layoutContainer}>
      <MypageComponent />
    </main>
  );
}

export default Mypage;
