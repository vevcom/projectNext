import styles from './page.module.scss'
import EditNews from './EditNews'
import CurrentNews from '@/app/news/CurrentNews'
import Article from '@/cms/Article/Article'
import { readNewsAction } from '@/actions/news/read'
import SlideInOnView from '@/app/components/SlideInOnView/SlideInOnView'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        orderAndName: string[]
    }
}

export default async function NewsArticle({ params }: PropTypes) {
    const order = parseInt(decodeURIComponent(params.orderAndName[0]), 10)
    const name = decodeURIComponent(params.orderAndName[1])
    if (!order || !name || params.orderAndName.length > 2) notFound()
    const res = await readNewsAction({
        articleName: name,
        order,
    })
    if (!res.success) notFound()
    const news = res.data

    return (
        <div className={styles.wrapper}>
            <Article article={news.article} />
            <SlideInOnView>
                <EditNews news={news}>
                    <div className={styles.moreNews}>
                        <h1>Flere nyheter</h1>
                        <div>
                            <CurrentNews not={news.id} />
                        </div>
                    </div>
                </EditNews>
            </SlideInOnView>
        </div>
    )
}
