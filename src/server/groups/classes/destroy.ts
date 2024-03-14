import 'server-only'
import type { ExpandedClass } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyGroup } from '@/server/groups/destroy'

export async function destroyClass(id: number): Promise<ActionReturn<ExpandedClass>> {
    return destroyGroup(id, 'CLASS')
}