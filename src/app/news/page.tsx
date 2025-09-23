import styles from './page.module.scss'
import AddNews from './AddNews'
import CurrentNews from './CurrentNews'
import CurrentNewsWithDrafts from './CurrentNewsWithDrafts'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Link from 'next/link'

type Props = {
    searchParams: {
        admin?: string
    }
}

export default async function NewsArtilces({ searchParams }: Props) {
    //TODO: add can create news permission
    const canCreateNews = true //temp
    const showAdmin = searchParams.admin === 'true'

    return (
        <PageWrapper title="Nyheter"
            headerItem={
                <div className={styles.head}>
                    <Link className={styles.archiveBtn} href="news/archive">Arkivet</Link>
                    <Link
                        className={styles.adminBtn}
                        href={showAdmin ? '/news' : '/news?admin=true'}
                    >
                        {showAdmin ? 'Vanlig visning' : 'Admin visning'}
                    </Link>
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
                {showAdmin ? (
                    <CurrentNewsWithDrafts />
                ) : (
                    <CurrentNews />
                )}
            </main>
        </PageWrapper>
    )
}
