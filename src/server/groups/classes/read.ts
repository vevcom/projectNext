import 'server-only'
import { readGroup, readGroups } from '@/server/groups/read'
import type { ExpandedClass } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readClasses(): Promise<ActionReturn<ExpandedClass[]>> {
    return readGroups('CLASS')
}

export async function readClass(id: number): Promise<ActionReturn<ExpandedClass>> {
    return readGroup(id, 'CLASS')
}
