export interface IFeatureContents {
  title: string;
  content: string;
  subContent?: string;
  image: string;
}

export const bigFeaturesContents: IFeatureContents[] = [
  {
    title: '다양한 활동',
    content:
      '지필, 수공예, 회상, 건강한 생활,색칠하기 등의 \n 여러가지 활동으로 구성되어 있어요.',
    image: '/images/icon1.svg'
  },
  {
    title: '활동 준비도 서류 작성도 간단하게',
    content: `매월 필요한 여러 서류를 한 번에 간단하게\n 출력하여 사용하실 수 있어요. `,
    image: '/images/icon2.svg'
  }
];

export const smallFeaturesContents: IFeatureContents[] = [
  {
    title: '3단계 난이도로 구성',
    content:
      '어르신의 인지 수준에 맞춰 학습할 수 \n 있도록 상 / 중 / 하 3단계로 구성하여 \n 매월 1일 업데이트해요.',
    image: '/images/icon3.svg'
  },
  {
    title: '경제적인 사용',
    content:
      '약정기간동안 매달 인원수와 \n 프린트매수에 제한 없이 \n 사용할 수 있어요.',
    image: '/images/icon4.svg'
  },
  {
    title: '기관을 위한 자료 구비',
    content: '기관에서 필요한 게시용 자료도 \n 바로 출력해서 사용할 수 있어요.',
    image: '/images/icon5.svg'
  }
];
