import styles from './page.module.scss'
import Article from '@/cms/Article/Article'
import create from '@/cms/articles/create'

export default async function Articles() {
    const article = await create('test')
    if (!article.success) return (<div>{article.error ? article.error[9].message : 'error'}</div>)

    return (
        <main className={styles.wrapper}>
            <Article article={article.data} />
        </main>
    )
}
