import { ExpandedArticle } from '@/services/cms/articles/Types'
import type { ExpandedCmsImage } from '@/services/cms/images/Types'
import type { Committee } from '@prisma/client'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}

export type ExpandedCommitteeWithArticle = ExpandedCommittee & {
    committeeArticle: ExpandedArticle
}
