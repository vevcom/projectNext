import 'server-only'
import type { ExpandedStudyProgramme } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { destroyGroup } from '@/server/groups/destroy'

export async function destroyClass(id: number): Promise<ActionReturn<ExpandedStudyProgramme>> {
    return destroyGroup(id, 'STUDY_PROGRAMME')
}