import styles from './page.module.scss'
import Article from '@/cms/Article/Article'
import { readArticle } from '@/cms/articles/read'
import PageWrapper from '../components/PageWrapper/PageWrapper'

export default async function Articles() {
    const article = await readArticle('om omega')
    if (!article.success) return (<div>{article.error ? article.error[9].message : 'error'}</div>)

    return (
        <PageWrapper title="Nyheter">
            <main className={styles.wrapper}>
                <Article article={article.data} />
            </main>
        </PageWrapper>
    )
}
