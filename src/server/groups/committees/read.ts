import 'server-only'
import { readGroup, readGroups } from '@/server/groups/read'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * Reads all committees
 */
export async function readCommittees(): Promise<ActionReturn<ExpandedCommittee[]>> {
    // TODO: This should be protected by a permission
    return readGroups('COMMITTEE')
}

export async function readCommittee(id: number): Promise<ActionReturn<ExpandedCommittee>> {
    return readGroup(id, 'COMMITTEE')
}
