import 'server-only'
import { adapterUserCutomFields } from '@/auth/feide/Types'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { AdapterUserCustom } from '@/auth/feide/Types'

export async function readAdapterUserByFeideAccount(feideId: string): Promise<AdapterUserCustom | null> {
    const account = await prisma.feideAccount.findUnique({
        where: {
            id: feideId
        },
        select: {
            user: {
                select: adapterUserCutomFields
            }
        }
    })

    if (account === null) {
        throw new ServerError('NOT FOUND', 'Account not found')
    }

    return account.user
}
