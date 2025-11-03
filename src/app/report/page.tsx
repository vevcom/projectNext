import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readPublicArticle } from '@/services/publicArticles/actions'
import PublicArticle from '@/components/Cms/PublicArticle/PublicArticle'


export default async function report() {
    const reportArticleRes = await readPublicArticle({ params: { special: 'REPORT_PAGE' } })
    const unwrappedArticle = unwrapActionReturn(reportArticleRes)

    return (
        <div className={styles.wrapper}>
            <PublicArticle article={unwrappedArticle} />
        </div>
    )
}
