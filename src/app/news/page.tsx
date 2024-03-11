import styles from './page.module.scss'
import AddNews from './AddNews'
import CurrentNews from './CurrentNews'
import AddHeaderItemPopUp from '@/components/AddHeaderItem/AddHeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Link from 'next/link'

export default async function NewsArtilces() {
    //TODO: add can create news permission
    const canCreateNews = true //temp

    return (
        <PageWrapper title="Nyheter"
            headerItem={
                <div className={styles.head}>
                    <Link className={styles.archiveBtn} href="news/archive">Arkivet</Link>
                    {
                        canCreateNews && (
                            <AddHeaderItemPopUp PopUpKey="createNewsPop">
                                <AddNews />
                            </AddHeaderItemPopUp>
                        )
                    }
                </div>
            }
        >
            <main className={styles.wrapper}>
                <CurrentNews />
            </main>
        </PageWrapper>
    )
}
