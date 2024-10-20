import type { ExpandedCmsImage } from "@/services/cms/images/Types"
import type { Company } from "@prisma/client"

export type CompanyCursor = { id: number }

export type CompanyDetails = { name?: string }

export type CompanyExpanded = Company & {
    logo: ExpandedCmsImage
}