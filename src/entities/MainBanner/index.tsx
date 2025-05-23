import { bannerStyle, bannerHeaderStyles } from './index.css';
import { Login } from './ui';
import { BeforeLogIn } from './ui/Login/BeforeLogIn';

export function MainBanner() {
  return (
    <div className={bannerStyle}>
      <div className={bannerHeaderStyles}>모두가 즐거운 우성인지펜</div>
      <Login />
    </div>
  );
}
