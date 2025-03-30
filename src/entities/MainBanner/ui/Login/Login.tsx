import React from 'react';
import { ConsultationInquiry } from './ ConsultationInquiry';
import { BeforeLogIn } from './BeforeLogIn';
import Logged from './Logged';
import { bannerContentsStyle } from './Login.css';

export function Login() {
  return (
    <div className={bannerContentsStyle}>
      {/* <Logged /> */}
      <BeforeLogIn />
      <ConsultationInquiry />
    </div>
  );
}
