import type { ExpandedCmsImage } from '@/cms/images/types'
import type { SchoolFieldsToExpose } from './ConfigVars'
import type { CmsLink, CmsParagraph, School } from '@/prisma-generated-pn-types'

export type SchoolFiltered = Pick<School, typeof SchoolFieldsToExpose[number]>

export type ExpandedSchool = SchoolFiltered & {
    cmsImage: ExpandedCmsImage,
    cmsParagraph: CmsParagraph,
    cmsLink: CmsLink,
}

export type SchoolCursor = {
    id: number
}
