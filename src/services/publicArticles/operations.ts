import '@pn-server-only'
import { publicArticleAuth } from './auth'
import { articleOperations } from '@/services/cms/articles/operations'
import type { SpecialCmsArticle } from '@prisma/client'

const publicSpecialArticles: SpecialCmsArticle[] = [
    'NEW_STUDENT_PAGE', 'REPORT_PAGE'
]

export const publicArticleOperations = {
    read: articleOperations.readSpecial.implement({
        authorizer: () => publicArticleAuth.read.dynamicFields({}),
        ownershipCheck: ({ params }) => publicSpecialArticles.includes(params.special)
    }),
    update: undefined, //TODO: implement...
} as const
