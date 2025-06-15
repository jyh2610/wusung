import type { Metadata } from 'next';
import './globals.css';
import { colors } from '@/design-tokens';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryProvider, NextUiProvider } from './_provider';

export const metadata: Metadata = {
  title: {
    default: '우성인지펜',
    template: '우성인지펜 | %s'
  },
  description:
    '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠를 제공하는 우성인지펜입니다. 5등급, 6등급 인지지원 활동지와 요양보호사를 위한 전문 프로그램을 만나보세요.',
  keywords:
    '우성인지펜, 노인학습지, 치매학습지, 실버학습지, 인지활동형프로그램, 노인프로그램, 방문요양프로그램, 주간보호프로그램, 인지5등급활동지, 인지등급, 학습지, 노인활동지, 치매활동지, 프린트학습지, 인지6등급, 6등급, 5등급 활동지, 5등급, 국민건강보험, 장기요양보험, 인지지원, 재가복지센터, 주간보호, 요양원, 요양병원, 치매, 인지, 독거노인, 어르신, 노인복지, 인지장애, 가족케어, 요양보호사, 치매자격증, 요양보호사 자격증, 재가센터, 노인복지센터',
  authors: [{ name: '우성인지펜' }],
  creator: '우성인지펜',
  publisher: '우성인지펜',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL('https://woosungpen.com'), // 실제 도메인으로 변경하세요
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: '우성인지펜 - 치매학습지 및 인지활동형프로그램',
    description:
      '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠를 제공하는 우성인지펜입니다.',
    type: 'website',
    locale: 'ko_KR',
    url: 'https://woosungpen.com',
    siteName: '우성인지펜',
    images: [
      {
        url: '/images/og-image.jpg', // 오픈그래프용 이미지를 추가하세요
        width: 1200,
        height: 630,
        alt: '우성인지펜 - 치매학습지 및 인지활동형프로그램'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '우성인지펜 - 치매학습지 및 인지활동형프로그램',
    description: '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠',
    images: ['/images/og-image.jpg']
  },
  icons: {
    icon: './favicon.png',
    shortcut: './favicon.png',
    apple: './favicon.png'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    // 구글 서치 콘솔 등록 후 verification 코드 추가
    // google: 'verification-code',
    // naver: 'verification-code',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1
  },
  themeColor: '#ffffff'
};

// 구조화된 데이터 (JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '우성인지펜',
  description: '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠',
  url: 'https://woosungpen.com',
  logo: 'https://woosungpen.com/favicon.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: '고객 서비스',
    availableLanguage: 'Korean'
  },
  offers: {
    '@type': 'Offer',
    category: '노인복지 서비스',
    description: '치매학습지, 인지활동형프로그램, 요양보호사 교육자료'
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <QueryProvider>
          <NextUiProvider>{children}</NextUiProvider>
        </QueryProvider>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
