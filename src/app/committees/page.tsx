import { readCommitteesAction } from '@/actions/groups/committees/read'
import Link from 'next/link'

export default async function Committees() {
    const res = await readCommitteesAction()
    if (!res.success) throw new Error('Kunne ikke hente komiteer - ' + res.errorCode)
    const committees = res.data
    return (
        <div>
            <h1>Komiteer</h1>
            {
                committees.map(committee => (
                    <Link href={`/committees/${committee.shortName}`} key={committee.shortName}>
                        {committee.name}
                    </Link>
                ))
            }
        </div>
    )
}
