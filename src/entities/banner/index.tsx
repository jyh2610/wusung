import { bannerStyle } from './index.css';
import { ConsultationInquiry, Login } from './ui';

export function Banner() {
  return (
    <section className={bannerStyle}>
      <Login />
    </section>
  );
}
