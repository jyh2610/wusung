export function getRouteKey(title: string, sub?: string): string | null {
  if (title === '우성인지펜 소개') {
    if (!sub) return 'introduce';
    if (sub === '인사말') return 'introduce_greeting';
    if (sub === '오시는길') return 'introduce_direction';
  }
  if (title === '요금안내') {
    if (!sub) return 'payment';
    if (sub === '요금 안내 및 결제') return 'payment_info';
  }
  if (title === '공지사항') {
    if (!sub) return 'notice';
    if (sub === '공지사항') return 'notice';
    if (sub === '1:1문의') return 'inquiry';
  }
  if (title === '마이페이지') return 'mypage';
  return null;
}
