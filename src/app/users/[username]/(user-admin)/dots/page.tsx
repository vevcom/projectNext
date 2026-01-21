import styles from './page.module.scss'
import { readDotWrappersForUserAction } from '@/services/dots/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Date from '@/components/Date/Date'

type PropTypes = {
    params: Promise<{
        username: string
    }>
}

export default async function UserDotAdmin({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'dots')
    const dotWrappers = unwrapActionReturn(
        await readDotWrappersForUserAction({ params: { userId: profile.user.id } })
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
