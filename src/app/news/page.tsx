import styles from './page.module.scss'
import PageWrapper from '../components/PageWrapper/PageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import AddNews from './AddNews'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CurrentNews from './CurrentNews'

export default async function NewsArtilces() {
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
                        showButtonClass={styles.addNews}
                    >
                        <AddNews />
                    </PopUp>
                )
            }
        >
            <main className={styles.wrapper}>
                <CurrentNews />
            </main>
        </PageWrapper>
    )
}
