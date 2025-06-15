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
