import '@pn-server-only'
import { publicArticleAuth } from './auth'
import { articleOperations } from '@/services/cms/articles/operations'
import type { SpecialCmsArticle } from '@prisma/client'
import { implementUpdateArticleOperations } from '@/cms/articles/implement'
import { z } from 'zod'

const publicSpecialArticles: SpecialCmsArticle[] = [
    'NEW_STUDENT_PAGE', 'REPORT_PAGE'
]

export const publicArticleOperations = {
    read: articleOperations.readSpecial.implement({
        authorizer: () => publicArticleAuth.read.dynamicFields({}),
        ownershipCheck: ({ params }) => publicSpecialArticles.includes(params.special)
    }),
    update: implementUpdateArticleOperations({
        authorizer: () => publicArticleAuth.update.dynamicFields({}),
        implementationParamsSchema: z.undefined(),
        ownedArticles: async ({ prisma }) =>
            await prisma.article.findMany({
                where: {
                    special: {
                        in: publicSpecialArticles
                    }
                },
                include: {
                    coverImage: true,
                    articleSections: {
                        include: {
                            cmsImage: true,
                            cmsLink: true,
                            cmsParagraph: true
                        }
                    }
                }
            })
    })
} as const
