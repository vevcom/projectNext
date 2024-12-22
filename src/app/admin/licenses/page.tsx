import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readLicensesAction } from '@/actions/licenses/read'
import Link from 'next/link'

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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
