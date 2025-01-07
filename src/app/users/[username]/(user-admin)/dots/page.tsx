import styles from './page.module.scss'
import { bindParams } from '@/actions/bindParams'

import { readDotWrappersForUserAction } from '@/actions/dots/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Date from '@/components/Date/Date'

export default async function UserDotAdmin(params: PropTypes) {
    const { profile } = await getProfileForAdmin(params, 'dots')
    const dotWrappers = unwrapActionReturn(
        await bindParams(readDotWrappersForUserAction, ({ userId: profile.user.id }))()
    )

    return (
        <div>
            <h2>Prikker</h2>
            <table className={styles.dotList}>
                <thead>
                    <tr>
                        <th>Grunn</th>
                        <th>For</th>
                        <th>Gitt av</th>
                        <th>Utløpstider</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dotWrappers.map(dotWrapper => (
                            <tr key={dotWrapper.id}>
                                <td>{dotWrapper.reason}</td>
                                <td>{dotWrapper.user.username}</td>
                                <td>{dotWrapper.accuser.username}</td>
                                <td>
                                    {
                                        dotWrapper.dots.map(dot => (
                                            <div className={dot.active ? '' : styles.inactive} key={dot.id}>
                                                <Date date={dot.expiresAt} />
                                            </div>
                                        ))
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
