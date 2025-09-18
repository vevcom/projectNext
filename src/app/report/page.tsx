import { readArticle } from '@/services/cms/articles/read'
import styles from './page.module.scss'
import Article from '@/components/Cms/Article/Article'


export default async function report() {
    const reportArticleRes = await readArticle({name:"varslingside",category:"guider"})
    if (!reportArticleRes){
        return (<p>Page not found</p>)
    }
    const article = reportArticleRes

    return (
        <div className={styles.wrapper}>
            <Article article={article} />
        </div>
    )
}
