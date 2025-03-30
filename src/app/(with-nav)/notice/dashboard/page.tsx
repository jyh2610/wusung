import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
function NoticeDashBoard() {
  return (
    <div>
      <div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: colors.gray_scale[900],
            paddingBottom: '40px'
          }}
        >
          공지사항
        </h1>
      </div>
      <div>
        <DashBoard rows={rows} />
      </div>
    </div>
  );
}

export default NoticeDashBoard;

const rows = [
  createData('Post 1', 'John Doe', '2025-03-01', 120),
  createData('Post 2', 'Jane Smith', '2025-03-02', 150),
  createData('Post 3', 'Alice Johnson', '2025-03-03', 98),
  createData('Post 4', 'Bob Brown', '2025-03-04', 75),
  createData('Post 5', 'Charlie Green', '2025-03-05', 220)
  // 데이터가 없으면 빈 배열로 설정 []
];
function createData(
  title: string,
  author: string,
  date: string,
  views: number
) {
  return { title, author, date, views };
}
