import type { ExpandedCmsImage } from '@/server/cms/images/Types'
import type { Committee } from '@prisma/client'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}
