import type { ExpandedArticle } from '@/cms/articles/types'
import type { ExpandedCmsImage } from '@/cms/images/types'
import type { Committee } from '@/prisma-generated-pn-types'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedImage
}

export type ExpandedCommitteeWithCover = ExpandedCommittee & {
    coverImage: ExpandedCmsImage
}

export type ExpandedCommitteeWithArticle = ExpandedCommittee & {
    committeeArticle: ExpandedArticle
}
