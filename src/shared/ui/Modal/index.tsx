'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Component, ReactNode, useState } from 'react';
import { overlayStyle, panelStyle } from './modal.css'; // 스타일 파s일 불러오기

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
}

export function Modal({ children, isOpen, setIsOpen }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <div className={overlayStyle}>
        <DialogPanel className={panelStyle}>{children}</DialogPanel>
      </div>
    </Dialog>
  );
}
