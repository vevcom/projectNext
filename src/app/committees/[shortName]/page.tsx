import styles from './page.module.scss'
import { readCommitteeMembersAction, readCommitteeParagraphAction } from '@/actions/groups/committees/read'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import UserCard from '@/components/User/UserCard'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function Committee({ params }: PropTypes) {
    const shortName = (await params).shortName
    const paragraphRes = await readCommitteeParagraphAction(shortName)
    if (!paragraphRes.success) throw new Error('Kunne ikke hente komitéparagraph')
    const membersRes = await readCommitteeMembersAction(shortName)
    if (!membersRes.success) throw new Error('Kunne ikke hente komitémedlemmer')

    const paragraph = paragraphRes.data
    const members = membersRes.data


    return (
        <div className={styles.wrapper}>
            <CmsParagraph cmsParagraph={paragraph} />

            <div className={styles.memberList}>
                {members.map((member, i) => <UserCard key={i} user={member.user} subText={`${member.order} ${member.active} ${member.title}`} />)}
            </div>
        </div>
    )
}
