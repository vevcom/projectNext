import type { ExpandedArticle } from '@/cms/articles/types'
import type { ExpandedCmsImage } from '@/cms/images/types'
import type { Committee } from '@/prisma-generated-pn-types'

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}

export type ExpandedCommitteeWithCover = ExpandedCommittee & {
    coverImage: ExpandedCmsImage
}

export type ExpandedCommitteeWithArticle = ExpandedCommittee & {
    committeeArticle: ExpandedArticle
}
