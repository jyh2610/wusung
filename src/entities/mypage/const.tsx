import { AiFillQuestionCircle } from 'react-icons/ai';
import { FaUserCog, FaCog } from 'react-icons/fa';
import { IoReceiptOutline } from 'react-icons/io5';
import {
  PaymentHistory,
  InquiryHistory,
  ManagerSettings,
  ProfileEdit
} from './ui/Content';

export const menuItems = [
  {
    label: '결제내역',
    icon: <IoReceiptOutline />,
    component: <PaymentHistory />
  },
  {
    label: '문의내역',
    icon: <AiFillQuestionCircle />,
    component: <InquiryHistory />
  },
  {
    label: '담당자 관리',
    icon: <FaUserCog />,
    component: <ManagerSettings />
  },
  { label: '회원정보 수정', icon: <FaCog />, component: <ProfileEdit /> }
];

// 유저 타입에 따라 메뉴를 필터링하는 함수
export const getFilteredMenuItems = (userType: string) => {
  if (userType === '법인') {
    return menuItems; // 법인인 경우 모든 메뉴 표시
  } else {
    // 개인인 경우 담당자 관리 메뉴 제외
    return menuItems.filter(item => item.label !== '담당자 관리');
  }
};
