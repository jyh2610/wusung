import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // guide 경로는 권한 체크를 건너뜁니다
  if (pathname.includes('/guide')) {
    return NextResponse.next();
  }

  // program 경로에 대한 권한 체크
  if (pathname.startsWith('/program')) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const url = new URL('/', request.url);
      const message = encodeURIComponent('로그인이 필요한 서비스입니다.');
      url.searchParams.set('toast', message);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/program/:path*']
};
