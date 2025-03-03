import { layoutContainer } from '../introduce/layout.css';
import { MypageComponent } from '@/entities/mypage';

function Mypage() {
  return (
    <main className={layoutContainer}>
      <MypageComponent />
    </main>
  );
}

export default Mypage;
