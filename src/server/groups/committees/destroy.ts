import 'server-only'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyGroup } from '@/server/groups/destroy'
import { readCommittee } from './read'
import { createPrismaActionError } from '@/actions/error'

export async function destroyCommittee(id: number): Promise<ActionReturn<ExpandedCommittee>> {
    const readCommitteeRes = await readCommittee(id)

    if (!readCommitteeRes.success) {
        return readCommitteeRes
    }
    
    try {
        await prisma.cmsImage.delete({
            where: {
                id: readCommitteeRes.data.logoImageId,
            },
        })
    } catch(e) {
        return createPrismaActionError(e)
    }

    return destroyGroup(id, 'COMMITTEE')
}