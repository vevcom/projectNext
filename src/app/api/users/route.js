import { Prisma } from '@prisma/client'

import prisma from "@/prisma"

export async function GET() {
    const users = await prisma.user.findMany()

    return Response.json(users)
}

export async function POST(req) {  
    const body = await req.json()
    
    const { email, firstname, lastname } = body;
    
    if (!email) {
        return Response.json({}, { status: 400 })
    }

    try {
    const user = await prisma.user.create({
        data: {
            email: email,
            firstname: firstname,
            lastname: lastname
        }
    })

    return Response.json(user)
    } catch (error) {  
        // synes dette er en veldig stygg måte å håndtere feil på
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return Response.json({}, { status: 409 })
        }       
    }   
}