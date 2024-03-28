import styles from './VisibilityLevelAdmin.module.scss'
import Form from '@/components/Form/Form'
import { updateVisibilityAction } from '@/actions/visibility/update'
import type { VisibilityRequiermentForAdmin } from '@/actions/visibility/Types'

type PropTypes = {
    data: VisibilityRequiermentForAdmin[]
    level: 'REGULAR' | 'ADMIN'
    levelName: string
}
export default function VisibilityLevelAdmin({ level, data, levelName }: PropTypes) {
    return (
        <div className={styles.VisibilityLevelAdmin}>
            <h2>{levelName}</h2>
            <Form
                className={styles.requierments}
                action={updateVisibilityAction.bind(null, level)}
            >
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
            </Form>
        </div>
    )
}
