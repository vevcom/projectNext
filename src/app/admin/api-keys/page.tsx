import PageWrapper from '@/app/components/PageWrapper/PageWrapper';
import styles from './page.module.scss';
import { AddHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import Form from '@/app/components/Form/Form';
import { createApiKeyAction } from '@/actions/api-keys/create';
import TextInput from '@/app/components/UI/TextInput';

export default async function ApiKeysAdmin() {
    return (
        <PageWrapper title="API-nøkler" headerItem={
            <AddHeaderItemPopUp PopUpKey="createApiKey">
                <Form 
                    title='Lag en ny nøkkel'
                    action={createApiKeyAction}
                >
                    <TextInput name="name" label="Navn" />
                </Form>
            </AddHeaderItemPopUp>
        }>
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