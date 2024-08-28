import styles from './page.module.scss'
import { readApiKeyAction } from '@/actions/api-keys/read'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'

type PropTypes = {
    params: {
        name: string
    }
}

export default async function ApiKeyAdmin({ params }: PropTypes) {
    const res = await readApiKeyAction(decodeURIComponent(params.name))
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'En feil har oppstått')
    const apiKey = res.data

    return (
        <PageWrapper title="API nøkkel">
            <div className={styles.wrapper}>
                <h2>Navn: {apiKey.name}</h2>
                <i>{apiKey.active ? 'Denne api nøkkelen er aktiv' : 'Denne api nøkkelen er inaktiv'}</i>
                <div className={styles.dates}>
                    <p>Utgår: {apiKey.expiresAt ? apiKey.expiresAt.toDateString() : 'ingen utløp'}</p>
                    <p>Opprettet: {apiKey.createdAt.toDateString()}</p>
                    <p>Sist oppdatert: {apiKey.updatedAt.toDateString()}</p>
                </div>

                <div className={styles.admin}>

                </div>
            </div>
        </PageWrapper>
    )
}
