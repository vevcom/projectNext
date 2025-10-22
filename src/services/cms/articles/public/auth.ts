import { RequireNothing } from '@/auth/auther/RequireNothing'

export const publicArticleAuth = {
    read: RequireNothing.staticFields({})
}
