import styles from './page.module.scss'
import Article from '@/cms/Article/Article'
import read from '@/cms/articles/read'

export default async function Articles() {
    const article = await read('about')
    if (!article.success) return (<div>{article.error ? article.error[9].message : 'error'}</div>)

    return (
        <main className={styles.wrapper}>
            <Article article={article.data} />
        </main>
    )
}
