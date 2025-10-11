import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCommitteeMembersAction } from '@/services/groups/committees/actions'
import UserCard from '@/components/User/UserCard'
import type { PropTypes } from '@/app/committees/[shortName]/page'

export default async function CommiteeMembers({ params }: PropTypes) {
    const shortName = (await params).shortName
    const members = unwrapActionReturn(await readCommitteeMembersAction({
        params: {
            shortName,
        }
    }))

    const membersGroupedByOrder = members.reduce((acc, member) => {
        const order = member.order
        if (!acc[order]) {
            acc[order] = []
        }
        acc[order].push(member)
        return acc
    }, {} as Record<number, typeof members>)

    const ordersSorted = Object.keys(membersGroupedByOrder).sort((a, b) => parseInt(b, 10) - parseInt(a, 10))

    return <div>
        <h2>Historiske medlemsskap</h2>

        {ordersSorted.map((order) =>
            <div key={order}>
                <h3 className={styles.orderHeading}>{order}. Orden</h3>
                <hr />
                <div className={styles.memberList}>
                    {membersGroupedByOrder[parseInt(order, 10)].map((member, i) => (
                        <UserCard
                            key={i}
                            user={member.user}
                            subText={member.title}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
}
