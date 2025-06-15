import { Metadata } from 'next';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

export function generateMetadata({
  title = '우성인지펜',
  description = '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠를 제공하는 우성인지펜입니다. 5등급, 6등급 인지지원 활동지와 요양보호사를 위한 전문 프로그램을 만나보세요.',
  keywords = '우성인지펜, 노인학습지, 치매학습지, 실버학습지, 인지활동형프로그램, 노인프로그램, 방문요양프로그램, 주간보호프로그램',
  ogImage = '/images/og-image.jpg',
  url = 'https://woosungpen.com'
}: GenerateMetadataProps): Metadata {
  const pageTitle = title === '우성인지펜' ? title : `${title} | 우성인지펜`;
  const fullUrl = url;

  return {
    title: pageTitle,
    description,
    keywords,
    authors: [{ name: '우성인지펜' }],
    creator: '우성인지펜',
    publisher: '우성인지펜',
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL('https://woosungpen.com'),
    alternates: {
      canonical: fullUrl
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
      locale: 'ko_KR',
      url: fullUrl,
      siteName: '우성인지펜',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage]
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
    }
  };
}

// 구조화된 데이터 생성 함수들
export function generateOrganizationSchema() {
  return {
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
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '우성인지펜',
    url: 'https://woosungpen.com',
    description: '치매학습지, 인지활동형프로그램 등 노인복지 관련 콘텐츠',
    inLanguage: 'ko',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://woosungpen.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}
