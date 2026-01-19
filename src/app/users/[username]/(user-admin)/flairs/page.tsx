import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import {
    assignFlairToUserAction,
    readAllFlairsAction,
    readUserFlairsAction,
    unAssignFlairToUserAction
} from '@/services/flairs/actions'
import Form from '@/components/Form/Form'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Flair from '@/components/Flair/Flair'
import { configureAction } from '@/services/configureAction'
import type { PropTypes } from '@/app/users/[username]/page'


export default async function FlairAdmin({ params }: PropTypes) {
    const { profile, session } = await getProfileForAdmin(await params, 'flairs')
    const usersFlairs = unwrapActionReturn(await readUserFlairsAction({ params: { userId: profile.user.id } }))
    const flairs = unwrapActionReturn(await readAllFlairsAction()).map(flair => ({
        ...flair,
        assignedToUser: usersFlairs.some(userFlair => userFlair.id === flair.id)
    }))

    return (
        <div className={styles.wrapper}>
            <div className={styles.flairContainer}>
                <table className={styles.flairList}>
                    <thead>
                        <tr>
                            <th>Flair</th>
                            <th>Navn</th>
                            <th>Handling</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flairs.map((flair) => (
                            <tr key={flair.id}>
                                <td><Flair flair={flair} width={100} session={session} /></td>
                                <td>{flair.name}</td>
                                <td>
                                    <Form
                                        submitText={flair.assignedToUser ? 'Fjern' : 'Tildel'}
                                        action={
                                            flair.assignedToUser
                                                ? configureAction(
                                                    unAssignFlairToUserAction,
                                                    { params: { userId: profile.user.id, flairId: flair.id } }
                                                )
                                                : configureAction(
                                                    assignFlairToUserAction,
                                                    { params: { userId: profile.user.id, flairId: flair.id } }
                                                )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >)
}
