import 'server-only'
import type { ExpandedInterestGroup } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyGroup } from '@/server/groups/destroy'

export async function destroyClass(id: number): Promise<ActionReturn<ExpandedInterestGroup>> {
    return destroyGroup(id, 'INTEREST_GROUP')
}