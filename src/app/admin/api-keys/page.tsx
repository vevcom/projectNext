import styles from './page.module.scss'
import CreateApiKeyForm from './CreateApiKeyForm'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import { v4 as uuid } from 'uuid'

export default async function ApiKeysAdmin() {
    return (
        <PageWrapper title="API-nøkler" headerItem={
            <AddHeaderItemPopUp PopUpKey="createApiKey">
                <CreateApiKeyForm />
            </AddHeaderItemPopUp>
        }>
            <ol className={styles.ApiKeysList}>
                {
                    [].map(x => (
                        <li key={uuid()}></li>
                    ))
                }
            </ol>
        </PageWrapper>
    )
}
