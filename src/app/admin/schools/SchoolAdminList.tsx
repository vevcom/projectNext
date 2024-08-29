import styles from './SchoolAdminList.module.scss'
import Link from 'next/link'
import type { SchoolFiltered } from '@/services/schools/Types'

type PropTypes = {
    schools: SchoolFiltered[]
}

export async function SchoolAdminList({ schools }: PropTypes) {
    return (
        <table className={styles.SchoolAdminList}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Navn</th>
                    <th>Kortnavn</th>
                </tr>
            </thead>
            <tbody>
                {schools.map(school => (
                    <Link href={`/admin/schools/${encodeURIComponent(school.name)}`}>
                        <tr key={school.id}>
                            <td>{school.id}</td>
                            <td>{school.name}</td>
                            <td>{school.shortname}</td>
                        </tr>
                    </Link>
                ))}
            </tbody>
        </table>
    )
}
