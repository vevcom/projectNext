import styles from './page.module.scss'
import CommitteeCard from '@/components/CommitteeCard/CommitteeCard'
import { readCommitteesAction } from '@/actions/groups/committees/read'
import { readSpecialImageAction } from '@/actions/images/read'

export default async function Committees() {
    const res = await readCommitteesAction()
    if (!res.success) throw new Error(`Kunne ikke hente komiteer - ${res.errorCode}`)
    const committees = res.data

    const strandardCommitteeLogoRes = await readSpecialImageAction.bind(
        null, { special: 'DAFAULT_COMMITTEE_LOGO' }
    )()
    const standardCommitteeLogo = strandardCommitteeLogoRes.success ? strandardCommitteeLogoRes.data : null

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
                                    image={committee.logoImage.image || standardCommitteeLogo}
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
