import styles from './page.module.scss'
import CommitteeCard from '@/components/Committee/CommitteeCard/CommitteeCard'
import { readAllCommitteesAction } from '@/services/groups/committees/actions'
import PageTitleSetter from '@/contexts/PageTitleSetter'

export default async function Committees() {
    const res = await readAllCommitteesAction()
    if (!res.success) throw new Error(`Kunne ikke hente komiteer - ${res.errorCode}`)
    const committees = res.data

    return (
        <div className={styles.wrapper}>
            <PageTitleSetter title={'Komiteer'} />
            {
                committees.length ? (
                    <div className={styles.committeeList}>
                        {
                            committees.map((committee) => (
                                <CommitteeCard
                                    key={committee.id}
                                    title={committee.name}
                                    href={`/committees/${committee.shortName}`}
                                    image={committee.logoImage}
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
