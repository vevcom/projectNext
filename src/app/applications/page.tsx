import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/PageWrapper'

export default async function Apllications() {
    return (
        <PageWrapper title="Søknadsperioder">
            <div className={styles.wrapper}>
                En søknad til omega er lurt vet du :)
                <div className={styles.periods}>

                </div>
            </div>
        </PageWrapper>
    )
}
