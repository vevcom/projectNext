import styles from './page.module.scss'
import Article from '@/components/Cms/Article/Article'
import { readSpecialArticle } from '@/cms/articles/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function report() {
    const reportArticleRes = await readSpecialArticle({ params: { specialCmsArticle: 'REPORT_PAGE' } })
    const unwrappedArticle = unwrapActionReturn(reportArticleRes)

    return (
        <div className={styles.wrapper}>
            <Article article={unwrappedArticle} />
        </div>
    )
}
