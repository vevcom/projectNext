import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import { Prisma } from '@prisma/client'

export const maxSections = 10 // Max 10 sections in an article

export const articleRealtionsIncluder = Prisma.validator<Prisma.ArticleInclude>()({
    articleSections: {
        include: articleSectionsRealtionsIncluder
    },
    coverImage: {
        include: {
            image: true
        },
    },
})
