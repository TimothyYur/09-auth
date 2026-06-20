import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSessionServer } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
}

function parseCookieAttributes(cookieStr: string): {
  name: string;
  value: string;
  options: CookieOptions;
} {
  const parts = cookieStr.split(';');
  const [nameValue] = parts;
  const [name, value] = nameValue.trim().split('=');

  const options: CookieOptions = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim();
    const [key, val] = part.split('=');

    if (key.toLowerCase() === 'path' && val) {
      options.path = val;
    } else if (key.toLowerCase() === 'max-age' && val) {
      options.maxAge = parseInt(val, 10);
    } else if (key.toLowerCase() === 'expires' && val) {
      options.expires = new Date(val);
    }
  }

  return { name, value, options };
}

function applySetCookieHeaders(response: NextResponse, cookieArray: string[]) {
  for (const cookieStr of cookieArray) {
    const { name, value, options } = parseCookieAttributes(cookieStr);
    const cleanOptions: CookieOptions = {};
    if (options.path) cleanOptions.path = options.path;
    if (options.maxAge) cleanOptions.maxAge = options.maxAge;
    if (options.expires) cleanOptions.expires = options.expires;

    response.cookies.set(name, value, cleanOptions);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    const data = await checkSessionServer();
    const setCookie = data.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      if (isPublicRoute) {
        const response = NextResponse.redirect(new URL('/', request.url));
        applySetCookieHeaders(response, cookieArray);
        return response;
      }

      if (isPrivateRoute) {
        const response = NextResponse.next();
        applySetCookieHeaders(response, cookieArray);
        return response;
      }
    }
  }

  if (!accessToken) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
