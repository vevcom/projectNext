import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from './page.module.scss';

export default async function Apllications() {
    return (
        <PageWrapper title="Søknader">
            <div className={styles.wrapper}>
                En søknad til omega er lurt vet du :)
                <div className={styles.periods}>

                </div>
            </div>
        </PageWrapper>
    )
}