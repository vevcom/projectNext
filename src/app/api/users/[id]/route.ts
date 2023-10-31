import prisma from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'

type ParamType = {
    params: {
        id: number
    }
}

export async function GET(request: NextRequest, { params }: ParamType) {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(params.id)
        }
    })
    if (!user) {
        return new NextResponse('user not found', {
            status: 404,
        })
    }
    return NextResponse.json(user)
}
