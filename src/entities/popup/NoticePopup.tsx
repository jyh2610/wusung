import React from 'react';

interface NoticePopupProps {
  title: string;
  content: string;
  onClose: () => void;
}

const NoticePopup: React.FC<NoticePopupProps> = ({ title, content, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-lg max-w-[500px] w-[90%] shadow-lg"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 m-0">{title}</h2>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="text-gray-600 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default NoticePopup; 