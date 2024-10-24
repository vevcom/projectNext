import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { SchoolFieldsToExpose } from './ConfigVars'
import type { CmsLink, CmsParagraph, School } from '@prisma/client'
import { CmsLinkCollapsed } from '@/services/cms/links/Types'

export type SchoolFiltered = Pick<School, typeof SchoolFieldsToExpose[number]>

export type ExpandedSchool<CmsLinkIsCollapsed extends boolean> = SchoolFiltered & {
    cmsImage: ExpandedCmsImage,
    cmsParagraph: CmsParagraph,
    cmsLink: CmsLinkIsCollapsed extends true ? CmsLinkCollapsed : CmsLink,
}

export type SchoolCursor = {
    id: number
}
