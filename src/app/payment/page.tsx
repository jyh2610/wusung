import { FloatingMenu } from '@/entities';
import { PaymentComponent } from '@/entities';
import { layoutContainer } from './page.css';

export type MenuList = {
  title: string;
  subTitle: Record<string, string>; // 문자열 키-값 구조
};

const menuList: MenuList = {
  title: '요금 안내',
  subTitle: {
    payment: '요금 안내 및 결제'
  }
};

function PaymentPage() {
  return (
    <section className={layoutContainer}>
      <FloatingMenu menuList={menuList} />
      <PaymentComponent />
    </section>
  );
}

export default PaymentPage;
