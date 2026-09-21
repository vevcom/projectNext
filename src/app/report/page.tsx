import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readPublicArticle } from '@/services/publicArticles/actions'
import PublicArticle from '@/components/Cms/PublicArticle/PublicArticle'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { publicArticleAuth } from '@/services/publicArticles/auth'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function Report() {
    const reportArticleRes = await readPublicArticle({ params: { special: 'REPORT_PAGE' } })
    const unwrappedArticle = unwrapActionReturn(reportArticleRes)

    const canEdit = publicArticleAuth.update.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <PageWrapper title="Varsling" className={styles.reportPage}>
            <PublicArticle article={unwrappedArticle} canEdit={canEdit} />
        </PageWrapper>
    )
}
