'use client';
import React, { CSSProperties } from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Dispatch, SetStateAction } from 'react';
import { overlayStyle, panelStyle } from './modal.css'; // 스타일 파s일 불러오기

interface ModalProps {
  children: JSX.Element;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalSize: CSSProperties;
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
