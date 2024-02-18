import styles from './page.module.scss'
import PageWrapper from '../components/PageWrapper/PageWrapper'
import { readNews } from '@/actions/news/read'
import ImageCard from '../components/ImageCard/ImageCard'

export default async function Articles() {
    const res = await readNews()
    if (!res.success) throw res.error ? 
        new Error(res.error[0].message) : 
        new Error('unknown error reading news')

    const news = res.data
    return (
        <PageWrapper title="Nyheter">
            <main className={styles.wrapper}>
                {
                    news.map(n => (
                        <ImageCard 
                            key={n.id} 
                            image={n.coverImage} 
                            title={n.articleName} 
                            href={`/news/${n.articleName}`}
                        />
                    ))
                }
            </main>
        </PageWrapper>
    )
}
