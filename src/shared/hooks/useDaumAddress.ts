// hooks/useDaumPostcode.ts
import { useDaumPostcodePopup } from 'react-daum-postcode';

const scriptUrl =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export const useAddressSearch = () => {
  const open = useDaumPostcodePopup(scriptUrl);

  const openAddressPopup = (onComplete: (address: string) => void) => {
    open({
      onComplete: data => {
        const fullAddress = data.address;
        onComplete(fullAddress); // 주소 값 콜백
      }
    });
  };

  return { openAddressPopup };
};
