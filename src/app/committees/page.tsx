import styles from './page.module.scss'
import CommitteeCard from '@/components/CommitteeCard/CommitteeCard'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readCommitteesAction } from '@/actions/groups/committees/read'
import Link from 'next/link'

export default async function Committees() {
    const res = await readCommitteesAction()
    if (!res.success) throw new Error(`Kunne ikke hente komiteer - ${res.errorCode}`)
    const committees = res.data

    return (
        <div className={styles.wrapper}>
            <h1>Komitéer</h1>
            {
                committees.length ? (
                    <div className={styles.committeeList}>
                    {
                        committees.map((committee) => (
                            <CommitteeCard
                                key={committee.id}
                                title={committee.name}
                                href={`/committees/${committee.shortName}`}
                                image={committee.logoImage.image}
                            />
                        ))
                    }
                    </div>

                ) : (
                    <i>
                        Ingen komiteer å vise
                    </i>
                )
            }
        </div>
    )
}
