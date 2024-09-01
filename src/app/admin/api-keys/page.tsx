import styles from './page.module.scss'
import CreateApiKeyForm from './CreateApiKeyForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readApiKeysAction } from '@/actions/api-keys/read'
import { displayDate } from '@/dates/displayDate'
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
            <div className={styles.wrapper}>
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
                                    <td>{displayDate(apiKey.createdAt)}</td>
                                    <td>{displayDate(apiKey.updatedAt)}</td>
                                    <td>{apiKey.expiresAt ? displayDate(apiKey.expiresAt) : 'Ikke satt'}</td>
                                    <td>{apiKey.active ? 'AKTIV' : 'INAKTIV'}</td>
                                </tr>
                            </Link>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    )
}
