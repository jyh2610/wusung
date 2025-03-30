import Link from 'next/link';
import React from 'react';
import { CustomImage } from '@/shared/ui';
import { VerticalLine } from '@/shared/ui/VerticalLine';
import { siteInfo } from '../const';
import { familySiteStyle } from '../index.css';
import {
  companyContainer,
  companyStyle,
  contentStyle,
  imageContainerStyle,
  siteStyle,
  titleStyle
} from './index.css';

export function Sites() {
  return (
    <div className={`${siteStyle} ${familySiteStyle}`}>
      {siteInfo.map((data, index) => (
        <>
          <Company
            key={index}
            title={data.title}
            content={data.content}
            src={data.image}
            link={data.link}
            alt={data.alt}
          />
          {index !== siteInfo.length - 1 && (
            <VerticalLine
              height="78px"
              thickness="1px"
              color={'rgba(239, 239, 239, 1)'}
            />
          )}
        </>
      ))}
    </div>
  );
}

export function Company({
  title,
  content,
  src,
  alt,
  link
}: {
  title: string;
  content: string;
  src: string;
  alt: string;
  link: string;
}) {
  return (
    <Link className={companyStyle} href={link}>
      <div className={companyContainer}>
        <div>
          <p className={titleStyle}>{title}</p>
          <p className={contentStyle}>
            {content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className={imageContainerStyle}>
          <CustomImage src={src} alt={alt} />
        </div>
      </div>
    </Link>
  );
}
