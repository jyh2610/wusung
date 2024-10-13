import Image from 'next/image';
import { NavLists } from './const';
import {
  NavStyle,
  ListContainerStyle,
  NavListStyle,
  LogoStyle
} from './index.css';
import { NavList } from './ui';

export function Nav() {
  return (
    <div className={NavStyle}>
      <div className={ListContainerStyle}>
        <div className={LogoStyle}>
          <Image fill src={'/images/logo.svg'} alt={'logo'} />
        </div>
        <div className={NavListStyle}>
          {NavLists.map((list, index) => (
            <NavList key={index} list={list} />
          ))}
        </div>
      </div>
    </div>
  );
}
