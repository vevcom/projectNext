import { readCommitees } from '@/actions/groups/committees/read'
import Link from 'next/link'

export default async function Committees() {
    const res = await readCommitees()
    if (!res.success) throw new Error('Kunne ikke hente komiteer')
    const committees = res.data
    return (
        <div>
            <h1>Komiteer</h1>
            {
                committees.map(committee => (
                    <Link href={`/committees/${committee.name}`} key={committee.name}>
                        {committee.name}
                    </Link>
                ))
            }
        </div>
    )
}
