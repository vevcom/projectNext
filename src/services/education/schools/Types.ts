import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { SchoolFieldsToExpose } from './ConfigVars'
import type { CmsParagraph, School } from '@prisma/client'

export type SchoolFiltered = Pick<School, typeof SchoolFieldsToExpose[number]>

export type ExpandedSchool = SchoolFiltered & {
    cmsImage: ExpandedCmsImage,
    cmsParagraph: CmsParagraph,
}
