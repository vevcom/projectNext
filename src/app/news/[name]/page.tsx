import styles from './page.module.scss'
import EditNews from './EditNews'
import CurrentNews from '@/app/news/CurrentNews'
import Article from '@/cms/Article/Article'
import { readNewsByIdOrName } from '@/actions/news/read'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        name: string
    }
}


export default async function NewsArticle({ params }: PropTypes) {
    const name = decodeURIComponent(params.name)
    const res = await readNewsByIdOrName(name)
    if (!res.success) notFound()
    const news = res.data

    return (
        <div className={styles.wrapper}>
            <Article article={news.article} />
            <EditNews news={news}>
                <span className={styles.moreNews}>
                    <h1>Flere nyheter</h1>
                    <CurrentNews not={news.id} />
                </span>
            </EditNews>
        </div>
    )
}
