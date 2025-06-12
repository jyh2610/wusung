import Image from 'next/image';
import React from 'react';

interface IProps {
  src: string;
  alt: string;
}

export function CustomImage({ src, alt }: IProps) {
  return <Image fill src={src} alt={alt} />;
}
