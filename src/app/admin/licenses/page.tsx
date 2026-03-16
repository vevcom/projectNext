import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { SettingsHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import Form from '@/app/_components/Form/Form'
import {
    destroyLicenseAction,
    createLicenseAction,
    updateLicenseAction,
    readAllLicensesAction
} from '@/services/licenses/actions'
import TextInput from '@/UI/TextInput'
import { configureAction } from '@/services/configureAction'
import Link from 'next/link'

export default async function Licenses() {
    const licenses = unwrapActionReturn(await readAllLicensesAction())

    return (
        <div className={styles.wrapper}>
            <h1>Lisenser</h1>
            <p>Lisenser brukes for bilder</p>
            <table className={styles.licenses}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Navn</th>
                        <th>Link</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {licenses.map((license) => (
                        <tr key={license.id}>
                            <td>{license.id}</td>
                            <td>{license.name}</td>
                            <td>
                                <Link href={license.link}>
                                    Til lisens
                                </Link>
                            </td>
                            <td>
                                <SettingsHeaderItemPopUp popUpKey={`LicenseSettings ${license.id}`}>
                                    <Form
                                        action={configureAction(updateLicenseAction, { params: { id: license.id } })}
                                        title="Endre lisens"
                                        submitText="Endre"
                                    >
                                        <TextInput name="name" label="Navn" defaultValue={license.name} />
                                        <TextInput name="link" label="Link" defaultValue={license.link} />
                                    </Form>

                                    <Form
                                        action={configureAction(destroyLicenseAction, { params: { id: license.id } })}
                                        submitText="Slett"
                                        submitColor="red"
                                        refreshOnSuccess
                                    />
                                </SettingsHeaderItemPopUp>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Form
                action={createLicenseAction}
                title="Lag ny lisens"
                submitText="Lag"
                refreshOnSuccess
            >
                <TextInput name="name" label="Navn" />
                <TextInput name="link" label="Link" />
            </Form>
        </div>
    )
}
