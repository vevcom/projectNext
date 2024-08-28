import styles from './page.module.scss'
import CreateApiKeyForm from './CreateApiKeyForm'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import { readApiKeysAction } from '@/actions/api-keys/read'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'

export default async function ApiKeysAdmin() {
    const res = await readApiKeysAction()
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'An error occurred')
    const apiKeys = res.data

    return (
        <PageWrapper title="API-nøkler" headerItem={
            <AddHeaderItemPopUp PopUpKey="createApiKey">
                <CreateApiKeyForm />
            </AddHeaderItemPopUp>
        }>
            <table className={styles.ApiKeysList}>
                <th>
                    <td>Navn</td>
                    <td>Opprettet</td>
                    <td>Sist oppdatert</td>
                    <td>Utløper</td>
                    <td>Status</td>
                </th>
                {
                    apiKeys.map(apiKey => (
                        <Link href={`/admin/api-keys/${apiKey.name}`} key={uuid()}>
                            <tr className={apiKey.active ? styles.activeated : styles.deactived}>
                                <td>{apiKey.name}</td>
                                <td>{apiKey.createdAt.toDateString()}</td>
                                <td>{apiKey.updatedAt.toDateString()}</td>
                                <td>{apiKey.expiresAt ? apiKey.expiresAt.toDateString() : 'Ikke satt'}</td>
                                <td>{apiKey.active ? 'AKTIV' : 'INAKTIV'}</td>
                            </tr>
                        </Link>
                    ))
                }
            </table>
        </PageWrapper>
    )
}
