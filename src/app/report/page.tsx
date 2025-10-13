import styles from './page.module.scss'
import Article from '@/components/Cms/Article/Article'
import { readSpecialArticle } from '@/cms/articles/actions'


export default async function report() {
    const reportArticleRes = await readSpecialArticle({ params: { specialCmsArticle: 'REPORT_PAGE' } })
    if (!reportArticleRes.success) {
        return (<p>Page not found. {reportArticleRes.errorCode}. {reportArticleRes.httpCode}</p>)
    }
    const article = reportArticleRes.data

    return (
        <div className={styles.wrapper}>
            <Article article={article} />
        </div>
    )
}
