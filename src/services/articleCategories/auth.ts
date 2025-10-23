import { RequireNothing } from '@/auth/auther/RequireNothing'

export const articleCategoryAuth = {
    //This should probably be a permoission:
    create: RequireNothing.staticFields({}),
    //Article categories will be auth on visibility spesific to each category.
    destroy: RequireNothing.staticFields({}),
    update: RequireNothing.staticFields({}),
    updateArticle: RequireNothing.staticFields({}),
    readAll: RequireNothing.staticFields({}), //auth filter!!
    read: RequireNothing.staticFields({}),
    removeArticleFromCategory: RequireNothing.staticFields({}),
    addArticleToCategory: RequireNothing.staticFields({}),
    // visibility another vicibility table ....
    readArticleInCategory: RequireNothing.staticFields({}),
}