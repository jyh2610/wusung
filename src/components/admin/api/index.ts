import request from '@/shared/api/axiosInstance';
import { ICategory } from '@/shared/type';

interface CategoryResponse {
  data: ICategory[];
  message: string;
}

export const getCategoryList = async (): Promise<ICategory[] | undefined> => {
  try {
    const res = await request<CategoryResponse>({
      method: 'GET',
      url: 'api/admin/category/list'
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};