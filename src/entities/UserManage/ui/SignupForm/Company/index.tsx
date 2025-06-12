// import React from 'react';
// import { FieldErrors, UseFormRegister } from 'react-hook-form';
// import { verifyCoporate } from '@/entities/UserManage/api';
// import { IForm } from '@/entities/UserManage/type';
// import { Button, Input } from '@/shared/ui';
// import { buttonContainer, inputContainer } from '../index.css';
// import { SignupInput } from '../SingnupInput';

// interface IProps {
//   register: UseFormRegister<IForm>;
//   errors: FieldErrors<IForm>;
// }
// export function CompanyForm({ register, errors }: IProps) {
//   const verifyCorporate = async () => {
//     try {
//       const res = await verifyCoporate({
//         b_no: '8834600572',
//         start_dt: '20230101',
//         p_nm: '우성인지��',
//         b_nm: '우성인지��'
//       });
//       console.log(res);
//     } catch {
//       console.error('Failed to verify corporate number');
//     }
//   };
//   return (
//     <div className={inputContainer}>
//       <SignupInput
//         label={'대표자명'}
//         placeholder={'사업주 이름을 입력해주세요'}
//         register={register('representativeName', {
//           required: { value: true, message: '반드시 입력해주세요' }
//         })}
//         error={errors.representativeName && errors.representativeName.message}
//       />
//       <SignupInput
//         label={'기관명'}
//         placeholder={'사업명을 입력해주세요'}
//         register={register('companyName', {
//           required: { value: true, message: '반드시 입력해주세요' }
//         })}
//         error={errors.companyName && errors.companyName.message}
//       />
//       <SignupInput
//         register={register('corporateNumber', {
//           required: { value: true, message: '반드시 입력해주세요' }
//         })}
//         label={'사업자 번호'}
//         placeholder={'사업자번호를 입력해주세요'}
//         error={errors.corporateNumber && errors.corporateNumber.message}
//       />
//       <SignupInput
//         register={register('openingDate', {
//           required: { value: true, message: '반드시 입력해주세요' }
//         })}
//         label={'개업일자'}
//         placeholder={'사업자번호를 입력해주세요'}
//         error={errors.openingDate && errors.openingDate.message}
//       />

//       <div className={buttonContainer}>
//         <Button
//           onClick={verifyCorporate}
//           type={'borderBrand'}
//           content={'기관 인증'}
//         />
//       </div>
//     </div>
//   );
// }
