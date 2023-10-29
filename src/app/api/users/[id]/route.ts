import prisma from "@/prisma"

type ParamType = {
    params: {
        id: number
    }
}

export async function GET(request: Request, { params }: ParamType) {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(params.id)
        }
    })
    if (!user) return new Response("user not found", {
        status: 404,
    })
    return Response.json(user)
}