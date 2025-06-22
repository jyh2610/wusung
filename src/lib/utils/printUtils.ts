import { toast } from 'react-toastify';

/**
 * PDF URL을 받아서 iframe을 통해 자동 인쇄를 실행하는 함수
 * @param pdfUrl - 인쇄할 PDF의 URL
 * @returns Promise<void>
 */
export const printPdfWithIframe = async (pdfUrl: string): Promise<void> => {
  console.log('printPdfWithIframe 시작 - pdfUrl:', pdfUrl);

  return new Promise((resolve, reject) => {
    // iframe을 생성해서 자동 프린트
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed'; // Make it fixed position
    iframe.style.right = '0'; // Place it outside the viewport
    iframe.style.bottom = '0'; // Place it outside the viewport
    iframe.style.width = '0'; // Make it zero width
    iframe.style.height = '0'; // Make it zero height
    iframe.style.border = 'none'; // Remove border
    iframe.style.visibility = 'hidden'; // Ensure it's not visible, though 0 size should be enough
    iframe.style.pointerEvents = 'none'; // Prevent mouse interactions

    console.log('iframe 생성 완료, src 설정:', pdfUrl);
    iframe.src = pdfUrl;

    iframe.onload = () => {
      console.log('iframe onload 이벤트 발생');
      // Use setTimeout with a slight delay to ensure the iframe content
      // is fully loaded and the print dialog is likely to appear.
      setTimeout(() => {
        console.log('setTimeout 실행, contentWindow 확인 중...');
        // Check if contentWindow exists before calling methods on it
        if (iframe.contentWindow) {
          try {
            console.log('contentWindow 존재, print() 호출 시도');
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            console.log('Print dialog initiated.');
            // 사용자 인터페이스에서는 보이지 않지만, 인쇄가 끝나면 아이프레임을 수동으로 제거하도록 안내하거나
            // 다른 이벤트를 통해 제거하는 로직을 추가할 수 있습니다.
            // 여기서는 사용자가 인쇄창을 닫으면 아이프레임은 자연스럽게 연결이 끊어지므로 DOM에 남아있어도 괜찮습니다.
            resolve();
          } catch (printError) {
            console.error('Error initiating print on iframe:', printError);
            toast.error('인쇄 대화 상자를 열 수 없습니다.');
            // 오류 발생 시 아이프레임 제거
            if (iframe.parentElement) {
              iframe.parentElement.removeChild(iframe);
            }
            reject(printError);
          }
        } else {
          console.error('iframe contentWindow is not available after load.');
          toast.error('인쇄 창을 열 수 없습니다.');
          // 오류 발생 시 아이프레임 제거
          if (iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
          }
          reject(new Error('iframe contentWindow is not available'));
        }
      }, 500); // 500ms delay - adjust if needed
    };

    // Optional: Add an onerror handler for the iframe
    iframe.onerror = e => {
      console.error('Error loading PDF in iframe:', e);
      toast.error('PDF 로딩 중 오류가 발생했습니다.');
      // Clean up the iframe even on error
      if (iframe.parentElement) {
        iframe.parentElement.removeChild(iframe);
      }
      reject(e);
    };

    console.log('iframe을 document.body에 추가');
    document.body.appendChild(iframe);

    // *** 이전 코드에서 아이프레임을 DOM에서 제거하는 setTimeout 부분을 삭제했습니다. ***
    // 아이프레임이 제거되지 않고 DOM에 유지되어 인쇄 대화 상자가 사라지지 않도록 합니다.
    // 사용자가 인쇄 대화 상자를 닫으면 아이프레임과의 연결이 해제됩니다.
  });
};

/**
 * 선택된 활동지 ID 배열을 받아서 인쇄를 실행하는 함수
 * @param selectedIds - 인쇄할 활동지 ID 배열
 * @param printUserPrint - PDF URL을 가져오는 API 함수
 * @returns Promise<void>
 */
export const printSelectedActivities = async (
  selectedIds: number[],
  printUserPrint: (ids: number[]) => Promise<string | undefined>
): Promise<void> => {
  try {
    if (selectedIds.length === 0) {
      toast.warn('인쇄할 활동지를 선택해주세요.');
      return;
    }

    const pdfUrl = await printUserPrint(selectedIds);

    if (pdfUrl) {
      await printPdfWithIframe(pdfUrl);
    } else {
      toast.error('PDF 파일을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('프린트 에러:', error);
    toast.error('인쇄 실패되었습니다!');
  }
};
