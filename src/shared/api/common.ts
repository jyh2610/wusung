import { NextResponse } from 'next/server';

export interface roleResDTO {
  data: 'ADMIN' | 'USER' | 'UNKNOWN';
  message: string;
}

export async function getRole(
  token: string | null
): Promise<roleResDTO | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/common/main/access-role`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      console.error('권한 조회 실패:', res.status);
      return null;
    }

    const data = (await res.json()) as roleResDTO;
    return data;
  } catch (error) {
    console.error('fetch 실패:', error);
    return null;
  }
}
