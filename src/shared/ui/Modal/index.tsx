'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Component, ReactNode, useState } from 'react';
import { overlayStyle, panelStyle } from './modal.css'; // 스타일 파s일 불러오기

interface ModalProps {
  children: JSX.Element;
  isOpen: boolean;
  setIsOpen: () => void;
  modalSize: { width: string; height: string };
}

export function Modal({ children, isOpen, setIsOpen, modalSize }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <div className={overlayStyle}>
        <DialogPanel style={modalSize} className={panelStyle}>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
