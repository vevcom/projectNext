import styles from './page.module.scss'
import Article from '@/cms/Article/Article'

export default async function Articles() {
    

    return (
        <main className={styles.wrapper}>
            <Article />
        </main>
    )
}
