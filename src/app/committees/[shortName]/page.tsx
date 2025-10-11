import styles from './page.module.scss'
import { readCommitteeMembersAction, readCommitteeParagraphAction } from '@/actions/groups/committees/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import UserCard from '@/components/User/UserCard'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function Committee({ params }: PropTypes) {
    const paramsAwaited = (await params)
    const paragraphRes = await readCommitteeParagraphAction(paramsAwaited)
    if (!paragraphRes.success) throw new Error('Kunne ikke hente komitéparagraph')
    const members = unwrapActionReturn(await readCommitteeMembersAction({
        shortName: paramsAwaited.shortName,
        active: true
    }))

    const paragraph = paragraphRes.data

    return (
        <div className={styles.wrapper}>
            <CmsParagraph cmsParagraph={paragraph} />

            <h2>Komitémedlemmer</h2>
            <div className={styles.memberList}>
                {members.map((member, i) => <UserCard
                    key={i}
                    user={member.user}
                    subText={member.title}
                />)}
            </div>
        </div>
    )
}
