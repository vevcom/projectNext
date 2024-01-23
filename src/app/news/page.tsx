import styles from './page.module.scss'
import ArticleSection from '../components/Cms/ArticleSection/ArticleSection'
import create from '@/actions/cms/articleSections/create'

export default async function Articles() {

    const articleRes = await create('test_article')
    if (!articleRes.success) throw new Error(articleRes.error ? articleRes.error[0].message : 'error')
    
    return (
        <main className={styles.wrapper}>
            <ArticleSection articleSection={articleRes.data} />
        </main>
    )
}
