import Image from 'next/image';
import { companyInfo } from '@/shared/const/Info';
import { container, content, numberBox, title } from './index.css';

export function SideCard() {
  return (
    <div className={container}>
      <p className={title}>고객센터</p>
      <p className={content}>
        언제든지 전화주시면 정성껏 <br /> 답변드리겠습니다.
      </p>
      <div className={numberBox}>
        <Image
          width={24}
          height={24}
          src={'/images/call.png'}
          alt={'callIcon'}
        />
        <span>{companyInfo.phone}</span>
      </div>
    </div>
  );
}
