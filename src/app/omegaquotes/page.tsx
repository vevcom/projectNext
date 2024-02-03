import Button from '../components/UI/Button'
import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/pageWrapper'

export default async function OmegaQuotes() {
    return (
        <PageWrapper title="Omega Qutoes" headerItem={
            <Button className={styles.button}>
                Ny omegaquote
            </Button> 
        }>
            <div className={styles.OmegaQuotes}>
                Content
            </div>
        </PageWrapper>
    )
}