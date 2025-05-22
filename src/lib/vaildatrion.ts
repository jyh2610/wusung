interface DateValidation {
  year: string;
  month: string;
  day: string;
}

export const validateBirthDate = ({
  year,
  month,
  day
}: DateValidation): { isValid: boolean; message: string } => {
  // 빈 값 체크
  if (!year || !month || !day) {
    return { isValid: false, message: '생년월일을 모두 입력해주세요.' };
  }

  // 숫자 변환
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);

  // 유효한 범위 체크
  if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return { isValid: false, message: '유효한 연도를 입력해주세요.' };
  }

  if (monthNum < 1 || monthNum > 12) {
    return { isValid: false, message: '유효한 월을 입력해주세요.' };
  }

  // 해당 월의 일수 체크
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) {
    return { isValid: false, message: '유효한 일을 입력해주세요.' };
  }

  // 만 14세 이상 체크
  const birthDate = new Date(yearNum, monthNum - 1, dayNum);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 14) {
    return { isValid: false, message: '만 14세 이상만 가입 가능합니다.' };
  }

  return { isValid: true, message: '' };
};

export const validatePhoneNumber = (
  phone: string
): { isValid: boolean; message: string } => {
  const phoneRegex = /^\d{10,11}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '유효한 전화번호를 입력해주세요.' };
  }

  return { isValid: true, message: '' };
};

export const validatePassword = (password: string) => {
  if (password.length < 8 || password.length > 20) {
    return '비밀번호는 8~20자 길이여야 하며, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
  }
  if (!/[A-Z]/.test(password)) {
    return '비밀번호는 8~20자 길이여야 하며, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
  }
  if (!/[a-z]/.test(password)) {
    return '비밀번호는 8~20자 길이여야 하며, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
  }
  if (!/[0-9]/.test(password)) {
    return '비밀번호는 8~20자 길이여야 하며, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return '비밀번호는 8~20자 길이여야 하며, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
  }
  return '';
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return '';
};
