import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const articleCategoryAuth = {
    create: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    updateArticle: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    readAll: RequireNothing.staticFields({}),
    read: RequireNothing.staticFields({}),
    removeArticleFromCategory: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    addArticleToCategory: RequirePermission.staticFields({ permission: 'PUBLIC_ARTICLE_ADMIN' }),
    readArticleInCategory: RequireNothing.staticFields({}),
}
