import type { Metadata } from 'next';
import './globals.css';
import { colors } from '@/design-tokens';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryProvider, NextUiProvider } from './_provider';

export const metadata: Metadata = {
  title: {
    default: '우성인지펜',
    template: '우성인지펜'
  },
  description: '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠',
  keywords:
    '우성인지펜, 노인학습지, 치매학습지, 실버학습지, 인지활동형프로그램, 노인프로그램, 방문요양프로그램, 주간보호프로그램, 인지5등급활동지, 인지등급, 학습지, 노인활동지, 치매활동지, 프린트학습지, 인지6등급, 6등급, 5등급 활동지, 5등급, 국민건강보험, 장기요양보험, 인지지원, 재가복지센터, 주간보호, 요양원, 요양병원, 치매, 인지, 독거노인, 어르신, 노인복지, 인지장애, 가족케어, 요양보호사, 치매자격증, 요양보호사 자격증, 재가센터, 노인복지센터',
  openGraph: {
    title: '우성인지펜',
    description: '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠',
    type: 'website'
  },
  icons: {
    icon: './favicon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          backgroundColor: colors.bg,
          position: 'relative'
        }}
      >
        <QueryProvider>
          <NextUiProvider>{children}</NextUiProvider>
        </QueryProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
