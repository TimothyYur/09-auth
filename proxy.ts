import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSessionServer } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Читаємо куки з поточного запиту
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
          // 1. Спочатку визначаємо правильний тип відповіді:
          // Якщо це публічний маршрут (/sign-in) — робимо РЕДІРЕКТ на '/', інакше — пропускаємо далі (.next)
          const response = isPublicRoute
            ? NextResponse.redirect(new URL('/', request.url))
            : NextResponse.next();

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
              // 2. Встановлюємо куки ВИКЛЮЧНО через response.cookies (як вимагає Next.js)
              response.cookies.set(cookieName, cookieValue, {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path || '/',
                maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
              });
            }
          }

          // 3. Якщо це приватний маршрут, прокидаємо нові куки в заголовки запиту,
          // але робимо це мутацією заголовків у вже створеному NextResponse.next(), не перезаписуючи сам об'єкт!
          if (!isPublicRoute) {
            for (const cookieStr of cookieArray) {
              const parsed = parse(cookieStr);
              const cookieName = parsed.accessToken
                ? 'accessToken'
                : parsed.refreshToken
                  ? 'refreshToken'
                  : Object.keys(parsed)[0];
              const cookieValue = parsed.accessToken || parsed.refreshToken || parsed[cookieName];
              if (cookieName && cookieValue) {
                // Додаємо куки до заголовків відповіді для поточного рендеру Server Components
                response.headers.append('Set-Cookie', cookieStr);
              }
            }
          }

          return response;
        }
      } catch (error) {
        console.error('Session update error in proxy:', error);

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

  // Якщо accessToken є в наявності від самого початку
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
