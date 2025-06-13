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
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/program/:path*']
};
