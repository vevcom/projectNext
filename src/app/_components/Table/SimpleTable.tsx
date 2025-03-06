
import styles from './SimpleTable.module.scss'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

export default function SimpleTable<T extends string[]>({
    header,
    body,
    links,
}: {
    header: T,
    body: Array<[...T]>,
    links?: T,
}) {
    return <table className={styles.table}>
        <thead>
            <tr>
                {header.map(item => <th key={uuid()}>{item}</th>)}
            </tr>
        </thead>
        <tbody>
            {links ? body.map((row, i) => <Link key={uuid()} href={links[i]}>
                <tr>
                    {row.map(item => <td key={uuid()}>{item}</td>)}
                </tr>
            </Link>
            ) : body.map(row => <tr key={uuid()}>
                {row.map(item => <td key={uuid()}>{item}</td>)}
            </tr>)}
        </tbody>
    </table>
}
