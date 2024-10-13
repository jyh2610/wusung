import { bannerStyle, bannerHeaderStyles } from './index.css';
import { Login } from './ui';

export function MainBanner() {
  return (
    <section className={bannerStyle}>
      <div className={bannerHeaderStyles}>모두가 즐거운 우성인지펜</div>
      <Login />
    </section>
  );
}
