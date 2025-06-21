'use client';

import React from 'react';
import Image from 'next/image';

const guideSteps = [
  {
    id: 1,
    title: '1단계',
    description: '이달의 인지활동지에 접속합니다.',
    image: '/images/1.png',
    tip: '💡 메인 페이지에서 인지활동지 메뉴를 클릭하세요.'
  },
  {
    id: 2,
    title: '2단계',
    description: '대상자 추가 버튼을 클릭합니다.',
    image: '/images/2.png',
    tip: '💡 우측 상단의 대상자 추가 버튼을 찾아 클릭하세요.'
  },
  {
    id: 3,
    title: '3단계',
    description: '대상자정보를 입력하여 추가합니다.',
    image: '/images/3.png',
    tip: '💡 대상자 추가 시 대상자 정보를 정확히 입력하여 추가합니다.'
  },
  {
    id: 4,
    title: '4단계',
    description: '대상자를 선택한 후 계획안 불러오기 버튼을 클릭 합니다.',
    image: '/images/4.png',
    tip: '💡 대상자 목록에서 원하는 대상자를 선택한 후 계획안을 불러오세요.'
  },
  {
    id: 5,
    title: '5단계',
    description: '인쇄 버튼을 클릭 합니다.',
    image: '/images/5.png',
    tip: '💡 계획안이 로드되면 인쇄 버튼을 클릭하여 진행하세요.'
  },
  {
    id: 6,
    title: '6단계',
    description: '날짜표기 여부를 선택하고 인쇄 버튼을 클릭 합니다.',
    image: '/images/6.png',
    tip: '💡 날짜 표기 옵션을 선택한 후 최종 인쇄를 진행하세요.'
  },
  {
    id: 7,
    title: '7단계',
    description: '활동지를 확인 하고 인쇄 버튼을 클릭 합니다.',
    image: '/images/7.png',
    tip: '💡 최종 활동지를 확인한 후 인쇄를 완료하세요.'
  }
];

function Guide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 rounded-lg">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            프로그램 가이드라인
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            단계별로 따라하시면 쉽게 프로그램을 이용하실 수 있습니다
          </p>
        </div>

        {/* 가이드 단계들 */}
        <div className="space-y-16">
          {guideSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* 이미지 섹션 */}
              <div className="flex-1 w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                    <Image
                      src={step.image}
                      alt={`${step.title} 이미지`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                      priority={index < 2}
                    />
                  </div>
                </div>
              </div>

              {/* 텍스트 섹션 */}
              <div className="flex-1 w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg">
                    {step.id}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {step.title}
                  </h2>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* 추가 설명이나 팁을 위한 공간 */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-700">{step.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 완료 메시지 */}
        <div className="text-center mt-20 p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">🎉 가이드라인 완료!</h2>
          <p className="text-lg opacity-90">
            모든 단계를 완료하셨습니다. 이제 프로그램을 자유롭게 이용하실 수
            있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Guide;
