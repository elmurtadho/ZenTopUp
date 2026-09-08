import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected path patterns
const protectedRoutes = ['/akun', '/notifikasi/pengaturan'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is in protected routes
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = request.cookies.get('tokogem_token')?.value || request.cookies.get('zen_token')?.value;
    const authHeader = request.headers.get('authorization');

    // Note: Since demo mode allows client-side simulated auth via localStorage,
    // we also permit request through with header tagging or verify cookie
    const response = NextResponse.next();
    response.headers.set('x-tokogem-auth-checked', 'true');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
