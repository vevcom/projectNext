import type { ExpandedArticle } from '@/server/cms/articles/Types'
import type { ExpandedCmsImage } from '@/server/cms/images/Types'
import type { Committee } from '@prisma/client'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}

export type ExpandedCommitteeWithArticle = ExpandedCommittee & {
    committeeArticle: ExpandedArticle
}
