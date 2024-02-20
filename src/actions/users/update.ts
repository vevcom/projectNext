import { ActionReturn } from '@/actions/type'
import errorHandler from '@/prisma/errorHandler'

export async function invalidateUserSessionData(userId: number): Promise<ActionReturn<void, false>> {
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {}
        })
    } catch(e) {
        return errorHandler(e)
    }

    return { success: true, data: undefined }
}