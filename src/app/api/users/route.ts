import { Prisma } from '@prisma/client'

import prisma from "@/prisma"
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const users = await prisma.user.findMany()

    return NextResponse.json(users)
}

export async function POST(req: NextRequest) {  
    const body = await req.json()
    
    const { username, password, email, firstname, lastname } = body;
    
    if (!username || !password || !email || !firstname || !lastname) {
        return NextResponse.json({}, { status: 400 })
    }

    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }
        })

        return NextResponse.json(user)
    } catch (error) {  
        // synes dette er en veldig stygg måte å håndtere feil på
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) 
        {
            return NextResponse.json({}, { status: 409 })
        }   
        
        return NextResponse.json({}, { status: 500 })
    }   
}