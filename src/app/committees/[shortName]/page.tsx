import styles from './page.module.scss'
import {
    readCommitteeMembersAction,
    readCommitteeParagraphAction,
    updateCommitteeParagraphAction
} from '@/services/groups/committees/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import UserCard from '@/components/User/UserCard'
import { configureAction } from '@/services/configureAction'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function Committee({ params }: PropTypes) {
    const paragraphRes = await readCommitteeParagraphAction({ params: await params })
    if (!paragraphRes.success) throw new Error('Kunne ikke hente komitéparagrafen')
    const members = unwrapActionReturn(await readCommitteeMembersAction({
        params: {
            shortName: (await params).shortName,
            active: true,
        },
    }))

    const paragraph = paragraphRes.data

    return (
        <div className={styles.wrapper}>
            <CmsParagraph
                cmsParagraph={paragraph}
                updateCmsParagraphAction={configureAction(
                    updateCommitteeParagraphAction,
                    { implementationParams: { shortName: (await params).shortName } }
                )}
            />

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
