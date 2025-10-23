import styles from './page.module.scss'
import Article from '@/components/Cms/Article/Article'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readPublicArticle } from '@/services/publicArticles/actions'


export default async function report() {
    const reportArticleRes = await readPublicArticle({ params: { special: 'REPORT_PAGE' } })
    const unwrappedArticle = unwrapActionReturn(reportArticleRes)

    return (
        <div className={styles.wrapper}>
            <Article article={unwrappedArticle} />
        </div>
    )
}
