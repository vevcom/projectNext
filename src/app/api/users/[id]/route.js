import prisma from "@/prisma"

export async function GET(request, { params }) {    
    const user = await prisma.user.findUnique({
        where: {
            id: params.id
        }
    })
    return Response.json(user)
}