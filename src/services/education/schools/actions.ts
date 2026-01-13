'use server'
import { schoolOperations } from './operations'
import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createSchoolValidation, updateSchoolValidation } from '@/education/schools/validation'
import { createSchool } from '@/services/education/schools/create'
import { destroySchool } from '@/services/education/schools/destroy'
import { makeAction } from '@/services/serverAction'
import { readSchools, readSchoolsPage, readStandardSchools } from '@/services/education/schools/read'
import { updateSchool } from '@/services/education/schools/update'
import type { ReadPageInput } from '@/lib/paging/types'
import type { CreateSchoolTypes, UpdateSchoolTypes } from '@/education/schools/validation'
import type { ExpandedSchool, SchoolCursor, SchoolFiltered } from '@/services/education/schools/types'
import type { ActionReturn } from '@/services/actionTypes'

export async function createSchoolAction(
    rawdata: FormData | CreateSchoolTypes['Type']
): Promise<ActionReturn<SchoolFiltered>> {
    const parse = createSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createSchool(data))
}

export async function destroySchoolAction(id: number): Promise<ActionReturn<void>> {
    return await safeServerCall(() => destroySchool(id))
}

export async function readSchoolsPageAction<const PageSize extends number>(
    pageReadInput: ReadPageInput<PageSize, SchoolCursor>
): Promise<ActionReturn<ExpandedSchool[]>> {
    return await safeServerCall(() => readSchoolsPage(pageReadInput))
}

export async function readStandardSchoolsAction(): Promise<ActionReturn<SchoolFiltered[]>> {
    return await safeServerCall(() => readStandardSchools())
}

export async function readSchoolsAction({
    onlyNonStandard
}: {
    onlyNonStandard: boolean
}): Promise<ActionReturn<SchoolFiltered[]>> {
    return await safeServerCall(() => readSchools({ onlyNonStandard }))
}

export const readSchoolAction = makeAction(schoolOperations.read)

export async function updateSchoolAction(
    id: number,
    rawdata: FormData | UpdateSchoolTypes['Type']
): Promise<ActionReturn<SchoolFiltered>> {
    const parse = updateSchoolValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateSchool(id, data))
}

export const updateSchoolCmsParagraphContentAction = makeAction(
    schoolOperations.updateCmsParagraphContent
)

export const updateSchoolCmsImageAction = makeAction(
    schoolOperations.updateCmsImage
)

export const updateSchoolCmsLinkAction = makeAction(
    schoolOperations.updateCmsLink
)
