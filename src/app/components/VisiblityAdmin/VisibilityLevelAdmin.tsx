import { VisibilityRequiermentForAdmin } from '@/actions/visibility/Types'
import styles from './VisibilityAdmin.module.scss'

type PropTypes = {
    data: VisibilityRequiermentForAdmin[]
    level: 'REGULAR' | 'ADMIN'
    levelName: string
}
export default function VisibilityLevelAdmin({ level, data, levelName } : PropTypes) {
    return (
        <div className={styles.VisibilityLevelAdmin}>
            <h4>{levelName}</h4>
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
    )
}
