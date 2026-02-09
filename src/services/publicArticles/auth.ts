import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const publicArticleAuth = {
    read: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' })
} as const
