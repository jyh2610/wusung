export const generateYears = () => {
  const currentYear = new Date().getFullYear(); // 현재 연도
  const startYear = 1900; // 시작 연도
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({
    value: (startYear + i).toString(),
    label: (startYear + i).toString()
  }));
};

// 월 리스트 생성
export const generateMonths = () =>
  Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));

// 일 리스트 생성 (년과 월을 기반으로 계산)
export const generateDays = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜
  return Array.from({ length: daysInMonth }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));
};

export const handleComplete = (data: {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}) => {
  let fullAddress = data.address;
  let extraAddress = '';

  if (data.addressType === 'R') {
    if (data.bname !== '') {
      extraAddress += data.bname;
    }
    if (data.buildingName !== '') {
      extraAddress +=
        extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
    }
    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
  }
  return data.address;
};
