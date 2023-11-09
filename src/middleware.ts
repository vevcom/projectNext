import { NextFetchEvent, NextResponse } from 'next/server'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

const authMiddleware = withAuth({
    pages: {
        signIn: '/login',
        error: '/login',
    }
})

const publicPaths = [
    '/', 
    '/ombul',
    '/infopages/committees',
    '/infopages/contactor',
    '/infopages/nystudent'
]

export function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
    if (publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    return authMiddleware(request, event)
}