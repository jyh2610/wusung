import Image from 'next/image';
import { colors } from '@/design-tokens';
import { container, content, imgContainer } from './page.css';

function Greeting() {
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
          인사말
        </h1>
      </div>
      <div className={container}>
        <div className={imgContainer}>
          <Image
            fill
            src={'/images/greeting.png'}
            alt={'completeCheck image'}
          />
        </div>
        <div className={content}>
          <span>
            지금 100세시대를 사는 우리들이 가장 두려워하는 질병은 암이 아닙니다.
            치매입니다.
            <br /> 치매는 정상적인 생활을 해오던 사람이 후천적으로 여러가지 인지
            기능이 떨어져서 일상생활을 제대로
            <br /> 수행하지 못하는 상태입니다.
          </span>

          <span>
            몸의 건강을 위해 운동을 하고 근육을 발달시키는 것처럼 우리의 뇌도
            골고루 매일 사용하면 활력있는
            <br /> 뇌를 유지할 수 있습니다. <br />
            뇌를 골고루 사용하기 위해 여러 영역에서 다양한 활동을 할 수 있도록
            우성인지펜이 준비했습니다. <br />
            우성인지펜은 일상 속에서 쉽게 접할 수 있는 내용으로 구성되고,
            어르신과 담당자 또는 어르신과 가족이 <br />
            도란도란 서로 즐겁게 소통하면서 동시에 인지 기능을 강화하는데 도움을
            줄 수 있는 활동지입니다.
          </span>

          <span>
            모두의 뇌건강을 지키고 어르신과 가족, 각 기관에서 일하시는 관리자를
            위해 즐겁게 생활할 수 있는 좋은 파트너가
            <br /> 될 수 있도록 끊임없이 노력하겠습니다.
            <br /> 감사합니다.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Greeting;
