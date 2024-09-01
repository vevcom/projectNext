import type { ExpandedCmsImage } from '@/services/cms/images/Types'
import type { Committee } from '@prisma/client'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}
