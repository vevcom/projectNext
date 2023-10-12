import { NextResponse } from "next/server"

import prisma from "@/prisma"

export async function GET() {
    const users = await prisma.user.findMany()

    return NextResponse.json(users)
}

export async function POST(req) {  
    const body = await req.json()
    
    const { email } = body;
    if (!email) {
        return NextResponse.json({}, { status: 400 })
    }

    const user = await prisma.user.create({
        data: {
            email: email
        }
    })

    return Response.json(user)
}