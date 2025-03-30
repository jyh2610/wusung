import { FaLocationDot } from 'react-icons/fa6';
import { IoMdCall, IoIosMail } from 'react-icons/io';
import { colors } from '@/design-tokens';
import { companyInfo } from '@/shared/const/Info';
import { HorizontalLine } from '@/shared/ui/VerticalLine';
import { container, infoContainer, infoTitle } from './page.css';

function Map() {
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
          오시는길
        </h1>
      </div>
      <div>
        <div className={container}>
          <div className={infoContainer}>
            <div className={infoTitle}>
              <IoMdCall size={18} color={colors.brand[100]} />
              전화번호
            </div>
            <span>{companyInfo.phone}</span>
          </div>
          <HorizontalLine width="100%" color={colors.brand[0]} />
          <div className={infoContainer}>
            <div className={infoTitle}>
              <FaLocationDot size={18} color={colors.brand[100]} />
              위치
            </div>
            <span>{companyInfo.address}</span>
          </div>
          <HorizontalLine width="100%" color={colors.brand[0]} />
          <div className={infoContainer}>
            <div className={infoTitle}>
              <IoIosMail size={18} color={colors.brand[100]} />
              이메일주소
            </div>
            <span>{companyInfo.email}</span>
          </div>
        </div>
        <KakaoMap />
      </div>
    </div>
  );
}

const KakaoMap = () => {
  return (
    <div
      style={{
        font: 'normal normal 400 12px/normal dotum, sans-serif',
        width: '928px',
        height: '40vh',
        color: '#333',
        position: 'relative',
        marginTop: '8px'
      }}
    >
      <div style={{ height: '402px' }}>
        <a
          href="https://map.kakao.com/?urlX=528453.0&urlY=1098666.0&name=%EA%B2%BD%EA%B8%B0%20%EC%84%B1%EB%82%A8%EC%8B%9C%20%EC%88%98%EC%A0%95%EA%B5%AC%20%EB%B3%B5%EC%A0%95%EB%A1%9C16%EB%B2%88%EA%B8%B8%2011&map_type=TYPE_MAP&from=roughmap"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="map"
            src="http://t1.daumcdn.net/roughmap/imgmap/03229efca28acab52f7521f9fc68e3bca0a9185b802ba0d36ee63c066d316918"
            width="928px"
            height="402px"
            style={{ border: '1px solid #ccc' }}
            alt="Kakao Map"
          />
        </a>
      </div>
      <div
        style={{
          overflow: 'hidden',
          padding: '7px 11px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '0px 0px 2px 2px',
          backgroundColor: 'rgb(249, 249, 249)'
        }}
      >
        <a
          href="https://map.kakao.com"
          target="_blank"
          style={{ float: 'left' }}
        >
          <img
            src="//t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png"
            width="72"
            height="16"
            alt="카카오맵"
            style={{ display: 'block', width: '72px', height: '16px' }}
          />
        </a>
      </div>
    </div>
  );
};
export default Map;
