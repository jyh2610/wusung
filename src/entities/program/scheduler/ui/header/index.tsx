import React from 'react';
import { MdLocalPrintshop } from 'react-icons/md';
import {
  headerContainer,
  titleStyle,
  printButton,
  iconStyle
} from './index.css';

function Header() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return (
    <div className={headerContainer}>
      <div className={titleStyle}>
        {year}년 {month}월
      </div>
      <button className={printButton} type="button">
        <MdLocalPrintshop className={iconStyle} size={24} />
        인쇄
      </button>
    </div>
  );
}

export default Header;
