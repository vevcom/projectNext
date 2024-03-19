import { readCommitees } from '@/actions/groups/committees/read'
import Link from 'next/link'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import styles from './page.module.scss'
import CommitteeCard from '../components/CommitteeCard/CommitteeCard'

export default async function Committees() {
    const res = await readCommitees()
    if (!res.success) throw new Error('Kunne ikke hente komiteer')
    const committees = res.data

    return (
        <div className={styles.CommitteeWrapper}>
        <PageWrapper title="Komiteer">
            {
                committees.map(committee => (
                    <Link href={`/committees/${committee.name}`} key={committee.name}>
                        {committee.name}
                    </Link>
                ))
            }
        </PageWrapper>
            <main className={styles.test}> {
                committees.length ? (
                    committees.map((committee) => (
                        <CommitteeCard
                            key={committee.id}
                            title={committee.name}
                            href={`/committees/${committee.name}`}
                            image={committee.logoImage}
                        >
                            {committee.description}
                        </CommitteeCard>
                    )
                )
                ) : (
                        <i>
                            Ingen kategorier å vise
                        </i>
                    )

            }
            </main>
        </div>
    )
}


//lag egen funksjon for oversikt over komitteene:
//export default async function CommitteeList() {
//    const res = await readCommitteeList()
//    if (!res.success) throw new Error(res.error ? res.error[0].message : 'Noe uforutsett skjedde')
//    const committees = res.data
//}
