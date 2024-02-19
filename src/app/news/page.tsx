import styles from './page.module.scss'
import PageWrapper from '../components/PageWrapper/PageWrapper'
import { readNews } from '@/actions/news/read'
import ImageCard from '@/components/ImageCard/ImageCard'
import PopUp from '@/components/PopUp/PopUp'
import AddNews from './AddNews'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default async function NewsArtilces() {
    const res = await readNews()
    if (!res.success) throw res.error ? 
        new Error(res.error[0].message) : 
        new Error('unknown error reading news')

    const news = res.data

    //TODO: add can create news permission
    const canCreateNews = true //temp

    return (
        <PageWrapper title="Nyheter"
            headerItem={
                canCreateNews && (
                    <PopUp
                        PopUpKey="CreateCategory"
                        showButtonContent={
                            <FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
                        }
                        showButtonClass={styles.addCategory}
                    >
                        <AddNews />
                    </PopUp>
                )
            }
        >
            <main className={styles.wrapper}>
                {
                    news.map(n => (
                        <ImageCard 
                            key={n.id} 
                            image={n.coverImage} 
                            title={n.articleName} 
                            href={`/news/${n.articleName}`}
                        >
                            {n.description}
                        </ImageCard>
                    ))
                }
            </main>
        </PageWrapper>
    )
}
