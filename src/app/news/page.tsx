import styles from './page.module.scss'
import ArticleSection from '../components/Cms/ArticleSection/ArticleSection'

export default async function Articles() {
    
    return (
        <main className={styles.wrapper}>
            <ArticleSection articleSection={} />
        </main>
    )
}
