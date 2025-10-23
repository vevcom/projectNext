import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const publicArticleAuth = {
    read: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' })
} as const
