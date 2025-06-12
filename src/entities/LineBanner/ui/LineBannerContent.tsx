'use client';

import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import {
  LineBannerContentStyles,
  contentStyles
} from './LineBannerContentStyles.css';

export function LineBannerContent({
  content,
  link
}: {
  content: string;
  link: string;
}) {
  const router = useRouter();

  return (
    <div className={LineBannerContentStyles} onClick={() => router.push(link)}>
      <span className={contentStyles}>
        {content}
        <FaArrowRight />
      </span>
    </div>
  );
}
