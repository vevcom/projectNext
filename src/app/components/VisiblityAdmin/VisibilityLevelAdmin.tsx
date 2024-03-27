import { VisibilityRequiermentForAdmin } from '@/actions/visibility/Types'
import styles from './VisibilityLevelAdmin.module.scss'

type PropTypes = {
    data: VisibilityRequiermentForAdmin[]
    level: 'REGULAR' | 'ADMIN'
    levelName: string
}
export default function VisibilityLevelAdmin({ level, data, levelName } : PropTypes) {
    return (
        <div className={styles.VisibilityLevelAdmin}>
            <h2>{levelName}</h2>
            <div className={styles.requierments}>
            {
                data.map(requiement =>
                    <div key={requiement.groups[0]?.id || requiement.name}>
                        <p>{requiement.name}</p>
                        {
                            requiement.groups.map(group =>
                                <p key={group.id}>{group.name}</p>
                            )
                        }
                    </div>
                )
            }
            </div>
        </div>
    )
}
