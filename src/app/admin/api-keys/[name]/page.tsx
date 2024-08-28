import styles from './page.module.scss'
import { readApiKeyAction } from '@/actions/api-keys/read'
import { updateApiKeyAction } from '@/actions/api-keys/update'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import Form from '@/app/components/Form/Form'
import DateInput from '@/app/components/UI/DateInput'
import TextInput from '@/app/components/UI/TextInput'
import DisplayAllPermissions from '@/app/components/Permission/DisplayAllPermissions'
import Slider from '@/app/components/UI/Slider'
import { displayDate } from '@/date/displayDate'

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
                    <p>Utgår: {apiKey.expiresAt ? displayDate(apiKey.expiresAt) : 'ingen utløp'}</p>
                    <p>Opprettet: {displayDate(apiKey.createdAt)}</p>
                    <p>Sist oppdatert: {displayDate(apiKey.updatedAt)}</p>
                </div>

                <div className={styles.admin}>
                    <h2>Endre på nøkkel</h2>
                    <Form
                        action={updateApiKeyAction.bind(null, apiKey.id)}
                        submitText="Oppdater"
                        refreshOnSuccess
                    >
                        <TextInput name="name" label="Navn" defaultValue={apiKey.name} />
                        <Slider label="Aktiv" name="active" defaultChecked={apiKey.active} />
                        <DateInput includeTime name="expiresAt" label="Utløpsdato" defaultValue={apiKey.expiresAt ?? undefined} />
                        <DisplayAllPermissions renderBesidePermission={permission => (
                            <input
                                type="checkbox"
                                name="permissions"
                                value={permission}
                                defaultChecked={apiKey.permissions.includes(permission)}
                            />
                        )}
                        />
                    </Form>
                </div>
            </div>
        </PageWrapper>
    )
}
