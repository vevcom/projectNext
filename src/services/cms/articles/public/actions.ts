'use server'
import { publicArticleOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readPublicArticle = makeAction(
    publicArticleOperations.read
)
