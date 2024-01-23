import styles from './page.module.scss'
import ArticleSection from '../components/Cms/ArticleSection/ArticleSection'
import create from '@/actions/cms/articleSections/create'

export default async function Articles() {

    create('test_article')
    
    return (
        <main className={styles.wrapper}>
            <ArticleSection articleSection={} />
        </main>
    )
}
