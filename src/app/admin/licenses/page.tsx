import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readLicensesAction } from '@/actions/licenses/read'
import Link from 'next/link'
import { SettingsHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import Form from '@/app/_components/Form/Form'
import { destroyLicense } from '@/actions/licenses/destroy'
import { createLicenseAction } from '@/actions/licenses/create'
import TextInput from '@/app/_components/UI/TextInput'

export default async function Licenses() {
    const licenses = unwrapActionReturn(await readLicensesAction.bind(null, {})())

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
                            <SettingsHeaderItemPopUp PopUpKey={`LicenseSettings ${license.id}`}>
                                <Form 
                                    action={destroyLicense.bind(null, { id: license.id })}
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
                action={createLicenseAction.bind(null, {})}
                title='Lag ny lisens'
                submitText='Lag'
                refreshOnSuccess
            >
                <TextInput name='name' label='Navn' />
                <TextInput name='link' label='Link' />
            </Form>
        </div>
    )
}
