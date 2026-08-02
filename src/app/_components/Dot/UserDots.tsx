import styles from './UserDots.module.scss'
import CreateDotForm from './CreateDotForm'
import DotExpieries from './DotExpieries'
import DotSettings from './DotSettings'
import DateDisplay from '@/components/Date/Date'
import type { DotExpanded } from '@/services/dots/types'

type PropTypes = {
    userId: number,
    dots: DotExpanded[],
    showCreateForm: boolean,
    showUpdateForm: boolean,
    showDestroyForm: boolean,
}

/**
 * Displays the dots of a single user with the expiery infered for each of their dot values.
 *
 * Choose which CRUD operations are offered using the show*Form props.
 * This should be linked to the authorizers.
 *
 * @param userId - The user the dots belong to. New dots are given to this user.
 * @param dots - The dots of the user, in ascending order of expiery.
 * @param showCreateForm - Whether to offer giving a new dot to the user.
 * @param showUpdateForm - Whether to offer changing the dots.
 * @param showDestroyForm - Whether to offer deleting the dots.
 */
export default function UserDots({
    userId,
    dots,
    showCreateForm,
    showUpdateForm,
    showDestroyForm,
}: PropTypes) {
    const valueLeft = dots.reduce((total, dot) => total + dot.valueLeft, 0)
    const showSettings = showUpdateForm || showDestroyForm

    return (
        <div className={styles.UserDots}>
            <div className={styles.header}>
                <span className={valueLeft > 0 ? styles.hasDots : styles.noDots}>
                    {valueLeft} aktive {valueLeft === 1 ? 'prikk' : 'prikker'}
                </span>
                {showCreateForm && <CreateDotForm userId={userId} />}
            </div>
            {
                dots.length === 0 ?
                    <i>Ingen prikker å vise</i> :
                    <table className={styles.dots}>
                        <thead>
                            <tr>
                                <th>Grunn</th>
                                <th>Gitt av</th>
                                <th>Gitt</th>
                                <th>Igjen</th>
                                <th>Utløpstider</th>
                                {showSettings && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dots.map(dot => (
                                    <tr key={dot.id}>
                                        <td>{dot.reason}</td>
                                        <td>{dot.accuser.username}</td>
                                        <td><DateDisplay date={dot.createdAt} includeTime={false} /></td>
                                        <td className={dot.valueLeft > 0 ? styles.hasDots : styles.noDots}>
                                            {dot.valueLeft} / {dot.value}
                                        </td>
                                        <td><DotExpieries dot={dot} /></td>
                                        {
                                            showSettings &&
                                            <td>
                                                <DotSettings
                                                    dot={dot}
                                                    showUpdateForm={showUpdateForm}
                                                    showDestroyForm={showDestroyForm}
                                                />
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    )
}
