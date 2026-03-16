import type { ExpandedCmsImage } from '@/cms/images/types'
import type { Company } from '@/prisma-generated-pn-types'

export type CompanyCursor = { id: number }

export type CompanyDetails = { name?: string }

export type CompanyExpanded = Company & {
    logo: ExpandedCmsImage
}
