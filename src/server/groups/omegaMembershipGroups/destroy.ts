import 'server-only'
import type { ExpandedOmegaMembershipGroup } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyGroup } from '@/server/groups/destroy'

export async function destroyClass(id: number): Promise<ActionReturn<ExpandedOmegaMembershipGroup>> {
    return destroyGroup(id, 'OMEGA_MEMBERSHIP_GROUP')
}