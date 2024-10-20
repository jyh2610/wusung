import { Header } from '../Header';
import { noticeContainer, noticeContents } from './index.css';
import { NoticeList, SideCard } from './ui';

export function Notice() {
  return (
    <div className={noticeContainer}>
      <Header title="Notice" content={'공지사항'} />
      <div className={noticeContents}>
        <NoticeList />
        <SideCard />
      </div>
    </div>
  );
}
