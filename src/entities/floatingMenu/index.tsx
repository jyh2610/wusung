'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdCall } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { routeMap } from '@/shared';
import { companyInfo } from '@/shared/const/Info';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { MenuList } from './const';
import {
  container,
  header,
  headerContainer,
  infoBodyCall,
  infoBodyLocation,
  infoContainer,
  infoText,
  infoTextBody,
  infoTitle,
  listContainer,
  listItem,
  selectedItem
} from './index.css';

export function FloatingMenu({ menuList }: { menuList: MenuList }) {
  const pathname = usePathname();
  const currentEndpoint = pathname.split('/').pop() || '';
  const firstEndpoint = pathname.split('/')[1] || '';
  const router = useRouter();

  const list = Object.keys(menuList.subTitle) as Array<
    keyof typeof menuList.subTitle
  >;

  return (
    <div className={container}>
      <div className={headerContainer}>
        <div className={header}>{menuList.title}</div>
        <HorizontalLine width="100%" color={colors.brand['200']} />
      </div>
      <ul className={listContainer}>
        {list.map(item => (
          <li
            className={`${listItem} ${currentEndpoint === item ? selectedItem : ''}`}
            key={item.toString()}
            onClick={() => router.push(`/${firstEndpoint}/${item}`)}
          >
            {menuList.subTitle[item]}
          </li>
        ))}
      </ul>

      <div className={infoContainer}>
        <div className={infoTitle}>
          <span className={infoText}>고객센터</span>
          <div className={infoTextBody}>
            언제든지 전화주시면 정성껏 <br />
            답변드리겠습니다.
          </div>
        </div>
        <div>
          <div className={infoBodyCall}>
            <IoMdCall size={24} color={colors.brand[100]} />
            <span>{companyInfo.phone}</span>
          </div>
          <div className={infoBodyLocation}>
            <FaLocationDot fontSize={24} color={colors.brand[100]} />
            <span>{companyInfo.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
