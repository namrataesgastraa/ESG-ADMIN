import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/admin/login']
const AUTH_REDIRECT = '/admin/login'
const DEFAULT_PROTECTED = '/admin/blogs'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value
  const isAuthenticated = Boolean(accessToken)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  if (pathname === '/' || pathname === '/admin') {
    return NextResponse.redirect(
      new URL(isAuthenticated ? DEFAULT_PROTECTED : AUTH_REDIRECT, request.url)
    )
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL(DEFAULT_PROTECTED, request.url))
  }

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL(AUTH_REDIRECT, request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}