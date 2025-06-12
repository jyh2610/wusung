import request from '@/shared/api/axiosInstance';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { IProduct, IProductDetail, IRegProduct } from './type';

export const getProduct = async (page: number, size: number) => {
  try {
    const response = await request<ApiResponse<PaginatedResponse<IProduct>>>({
      method: 'GET',
      url: '/api/admin/product/list',
      params: {
        page,
        size
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const regProduct = async (product: IRegProduct) => {
  try {
    const response = await request<ApiResponse<IProduct>>({
      method: 'POST',
      url: '/api/admin/product',
      data: product
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const updateProduct = async (
  productId: number,
  product: IRegProduct
) => {
  try {
    const response = await request<ApiResponse<IProduct>>({
      method: 'PUT',
      url: `/api/admin/product/${productId}`,
      data: product
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/api/admin/product/${productId}`
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getProductDetail = async (productId: number) => {
  try {
    const response = await request<ApiResponse<IProductDetail>>({
      method: 'GET',
      url: `/api/admin/product/${productId}`
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
