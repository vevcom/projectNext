import PageWrapper from '@/app/components/PageWrapper/PageWrapper';
import styles from './page.module.scss';

export default async function ApiKeysAdmin() {
    return (
        <PageWrapper title="API-nøkler">
            <ol className={styles.ApiKeysList}>
            {
                [].map(x => (
                    <li></li>
                ))
            }
            </ol>
        </PageWrapper>
    )
}