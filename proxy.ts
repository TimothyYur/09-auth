import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken) {
    if (refreshToken) {
      try {
        const data = await checkSessionServer();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          let response = NextResponse.next();

          if (isPublicRoute) {
            response = NextResponse.redirect(new URL('/', request.url));
          }

          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const cookieName = parsed.accessToken
              ? 'accessToken'
              : parsed.refreshToken
                ? 'refreshToken'
                : Object.keys(parsed)[0];
            const cookieValue = parsed.accessToken || parsed.refreshToken || parsed[cookieName];

            if (cookieName && cookieValue) {
              response.cookies.set(cookieName, cookieValue, {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path || '/',
                maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
              });
            }
          }
          return response;
        }
      } catch (error) {
        console.error('Session pdate error in proxy:', error);
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
