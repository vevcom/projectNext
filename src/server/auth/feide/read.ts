import 'server-only'
import { adapterUserCutomFields } from '@/auth/feide/Types'
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

    return account && account.user
}
