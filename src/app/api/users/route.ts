import { Prisma, User } from '@prisma/client'

import prisma from "@/prisma"

export async function GET() {
    const users = await prisma.user.findMany()

    return Response.json(users)
}

export async function POST(req: Request) {  
    const body = await req.json()
    
    const { username, password, email, firstname, lastname } = body;
    
    if (!username || !password || !email || !firstname || !lastname) {
        return Response.json({}, { status: 400 })
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

        return Response.json(user)
    } catch (error) {  
        // synes dette er en veldig stygg måte å håndtere feil på
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) 
        {
            return Response.json({}, { status: 409 })
        }   
        
        return Response.json({}, { status: 500 })
    }   
}