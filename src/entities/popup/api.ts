  import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';


export interface Popup {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getPopup = async () => {
 try {
  const response = await request<ApiResponse<Popup[]>>({url:'/api/common/main/popup/list', method: 'GET'});  
  return response.data.data;
 } catch (error) {
  throw error;
 }
};