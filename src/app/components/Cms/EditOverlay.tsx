import styles from './EditOverlay.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

/**
 * 
 * This component is used to show an edit 
 * icon on top of cms elements to activate editing when in editmode
 */
export default function EditOverlay() {
    return (
        <div className={styles.EditOverlay}>
            <div className={styles.editIcon}>
                <FontAwesomeIcon icon={faPencil} />
            </div>
        </div>
    )
}  