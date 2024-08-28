import styles from './page.module.scss'
import CreateApiKeyForm from './CreateApiKeyForm'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import { readApiKeysAction } from '@/actions/api-keys/read'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'

const popUpKey = 'createApiKey'

export default async function ApiKeysAdmin() {
    const res = await readApiKeysAction()
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'An error occurred')
    const apiKeys = res.data

    return (
        <PageWrapper title="API-nøkler" headerItem={
            <AddHeaderItemPopUp PopUpKey={popUpKey}>
                <CreateApiKeyForm popUpKey={popUpKey} />
            </AddHeaderItemPopUp>
        }>
            <table className={styles.ApiKeysList}>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Opprettet</th>
                        <th>Sist oppdatert</th>
                        <th>Utløper</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {apiKeys.map(apiKey => (
                        <Link href={`/admin/api-keys/${apiKey.name}`} key={uuid()} passHref>
                            <tr className={apiKey.active ? styles.activated : styles.deactivated}>
                                <td>{apiKey.name}</td>
                                <td>{apiKey.createdAt.toDateString()}</td>
                                <td>{apiKey.updatedAt.toDateString()}</td>
                                <td>{apiKey.expiresAt ? apiKey.expiresAt.toDateString() : 'Ikke satt'}</td>
                                <td>{apiKey.active ? 'AKTIV' : 'INAKTIV'}</td>
                            </tr>
                        </Link>
                    ))}
                </tbody>
            </table>
        </PageWrapper>
    )
}
