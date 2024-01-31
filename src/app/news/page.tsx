import styles from './page.module.scss'
import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import read from '@/actions/cms/articleSections/read'

export default async function Articles() {
    const articleSectionRes = await read('test_article')
    if (!articleSectionRes.success) throw new Error(articleSectionRes.error ? articleSectionRes.error[0].message : 'error')
    const articleSection = articleSectionRes.data

    return (
        <main className={styles.wrapper}>
            <ArticleSection articleSection={articleSection} />
        </main>
    )
}
