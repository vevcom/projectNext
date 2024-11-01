import { CmsLinkType, Prisma } from '@prisma/client'

export const CmsLinkRelationsIncluder = {
    imageCollection: {
        select: {
            name: true
        }
    },
    newsArticle: {
        select: {
            orderPublished: true,
            articleName: true,
        }
    },
    articleCategoryArticle: {
        select: {
            name: true,
            articleCategory: {
                select: {
                    name: true
                }
            }
        }
    }
} as const satisfies Prisma.CmsLinkInclude

const CmsLinkTypeConfig = {
    RAW_URL: { label: 'Lenke til URL' },
    NEWS: { label: 'Nyhet' },
    ARTICLE_CATEGORY_ARTICLE: { label: 'Artikkel' },
    IMAGE_COLLECTION: { label: 'Bilde samling' }
} satisfies Record<CmsLinkType, { label: string }>

export const CmsLinkTypeOptions = Object.values(CmsLinkType).map(type => ({
    value: type,
    label: CmsLinkTypeConfig[type].label
}))