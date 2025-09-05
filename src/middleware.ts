import { defineMiddleware } from 'astro:middleware';

const STATIC_FILE_PATTERNS = [
  /\.(js|css|map|json|xml|txt|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i,
  /^(favicon|robots|sitemap|manifest)/i,
  /installHook/i,
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  if (STATIC_FILE_PATTERNS.some(pattern => pattern.test(pathname))) {
    return new Response('Not Found', { status: 404 });
  }
  
  return next();
});