import prisma from "@/prisma"

type ParamType = {
    params: {
        id: number
    }
}

export async function GET(request: Request, { params }: ParamType) {   
    if (!params.id) return new Response("needs a user id", {
        status: 400
    })
    const user = await prisma.user.findUnique({
        where: {
            id: Number(params.id)
        }
    })
    return Response.json(user)
}