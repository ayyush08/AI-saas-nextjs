import { NextResponse,NextRequest } from 'next/server'
// import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware" //apply on all routes
import { getToken } from "next-auth/jwt"


export async function middleware(request: NextRequest) {

    const token = await getToken({
        req:request
    })
    const url = request.nextUrl

    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher:[ '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*', // all paths after /dashboard
        '/verify/:path*', // all paths after /verify
    ],
}