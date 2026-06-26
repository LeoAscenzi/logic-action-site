import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

export default createMiddleware(
  defineRouting({
    // locales: ['en', 'zh'],
    locales: ['en'], // TODO RE-ADD CHINESE WHEN WE HAVE TLs
    defaultLocale: 'en',
  })
);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};